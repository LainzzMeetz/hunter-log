# backend/main.py
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from typing import List, Optional
from datetime import datetime, timedelta

from models import (
    Player, Stats, Condition, Quest, Skill, Achievement, 
    HealthMetric, InventoryItem, MapChapter, Boss,
    SubTask, JournalEntry
)

class Settings(BaseSettings):
    DATABASE_URL: str
    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI()

@app.on_event("startup")
async def on_startup():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(database=client.hunters_log_db, document_models=[
        Player, Quest, Skill, Achievement, HealthMetric, 
        InventoryItem, MapChapter, Boss, JournalEntry
    ])
    print("...Connected to MongoDB!")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

async def get_player_instance():
    player = await Player.find_one(Player.username == "Laingam")
    if not player: raise HTTPException(status_code=404, detail="Player not found.")
    return player

@app.get("/")
async def root():
    return {"message": "Hunter's Log: [System Core v12.3 Online]"}

@app.get("/api/player", response_model=Player)
async def get_player(): return await get_player_instance()

@app.put("/api/player/set-track", response_model=Player)
async def set_active_track(data: dict = Body(...)):
    player = await get_player_instance(); track_name = data.get("track")
    if not hasattr(player.stats, track_name): raise HTTPException(status_code=400, detail="Invalid skill track name.")
    player.active_skill_track = track_name; await player.save(); return player

@app.put("/api/quests/{quest_id}/achieve", response_model=Player)
async def achieve_main_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id);
    if not quest or quest.completed: return await get_player_instance()
    if quest.type == "daily": raise HTTPException(status_code=400, detail="Cannot manually achieve a Daily Quest.")
    quest.completed = True; await quest.save(); player = await get_player_instance()
    if quest.stat_reward and quest.stat_points > 0:
        current_stat_val = getattr(player.stats, quest.stat_reward, 1); setattr(player.stats, quest.stat_reward, current_stat_val + quest.stat_points)
    player.exp += quest.exp_grant; player.awakening_gauge = min(player.awakening_gauge + (quest.exp_grant // 2), 100); leveled_up = False
    while player.exp >= player.exp_to_next_level:
        player.level += 1; player.exp -= player.exp_to_next_level; player.exp_to_next_level = int(player.exp_to_next_level * 1.15); leveled_up = True
    await player.save(); return player

@app.get("/api/quests", response_model=List[Quest])
async def get_quests(type: str = None):
    if type: return await Quest.find(Quest.type == type).to_list()
    return await Quest.find_all().to_list()

# --- THIS IS THE FIX ---
# The colon ':' at the end of this line has been removed.
@app.get("/api/quests/{quest_id}", response_model=Quest)
async def get_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id)
    if not quest: raise HTTPException(status_code=404, detail="Quest not found")
    return quest

@app.put("/api/quests/{quest_id}/subtask/{sub_task_title}", response_model=Quest)
async def toggle_sub_task(quest_id: PydanticObjectId, sub_task_title: str):
    quest = await Quest.get(quest_id);
    if not quest: raise HTTPException(status_code=404, detail="Quest not found.");
    task_found = False; all_tasks_complete = True;
    for task in quest.sub_tasks:
        if task.title == sub_task_title: task.completed = not task.completed; task_found = True
        if not task.completed: all_tasks_complete = False
    if not task_found: raise HTTPException(status_code=44, detail="Sub-task not found.");
    if all_tasks_complete: quest.completed = True; await quest.save(); return quest

@app.put("/api/quests/{quest_id}/complete", response_model=Player)
async def complete_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id);
    if not quest or quest.completed: return await get_player_instance()
    if not quest.sub_tasks: quest.completed = True
    if quest.completed == False: raise HTTPException(status_code=400, detail="All sub-tasks must be completed first.")
    await quest.save(); player = await get_player_instance()
    if quest.stat_reward == "study":
        track = player.active_skill_track; current_stat_val = getattr(player.stats, track, 1); setattr(player.stats, track, current_stat_val + quest.stat_points)
    elif quest.stat_reward and quest.stat_points > 0:
        current_stat_val = getattr(player.stats, quest.stat_reward, 1); setattr(player.stats, quest.stat_reward, current_stat_val + quest.stat_points)
    player.exp += quest.exp_grant; player.awakening_gauge = min(player.awakening_gauge + (quest.exp_grant // 2), 100); leveled_up = False
    while player.exp >= player.exp_to_next_level:
        player.level += 1; player.exp -= player.exp_to_next_level; player.exp_to_next_level = int(player.exp_to_next_level * 1.15); leveled_up = True
    await player.save(); return player

@app.get("/api/journal", response_model=List[JournalEntry])
async def get_journal_entries(): return await JournalEntry.find_all().sort("-date").to_list()
@app.post("/api/journal", response_model=JournalEntry)
async def create_journal_entry(entry_data: dict = Body(...)):
    if not entry_data.get("content") or not entry_data.get("category"): raise HTTPException(status_code=400, detail="Category and content are required.")
    entry = JournalEntry(category=entry_data["category"], content=entry_data["content"]); await entry.insert(); return entry
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(): return await Skill.find_all().to_list()
@app.post("/api/skills", response_model=Skill)
async def add_skill(new_skill: dict = Body(...)):
    if "name" not in new_skill or not new_skill["name"].strip(): raise HTTPException(status_code=400, detail="Skill name is required.")
    tree_name = new_skill.get("tree", "general"); description_text = new_skill.get("description", "User-logged skill.")
    skill_entry = Skill(name=new_skill["name"].strip(), tree=tree_name, description=description_text); await skill_entry.insert(); return skill_entry
@app.get("/api/achievements", response_model=List[Achievement])
async def get_achievements(): return await Achievement.find_all().to_list()

@app.get("/api/map", response_model=List[MapChapter])
async def get_map(): return await MapChapter.find().sort("chapter").to_list()
@app.post("/api/map", response_model=MapChapter)
async def create_map_chapter(chapter_data: dict = Body(...)):
    if not chapter_data.get("title") or not chapter_data.get("description"): raise HTTPException(status_code=400, detail="Title and description are required.")
    existing_chapters = await MapChapter.find_all().to_list(); next_chapter = max([c.chapter for c in existing_chapters], default=0) + 1
    chapter = MapChapter(chapter=next_chapter, title=chapter_data["title"], description=chapter_data["description"], status="locked"); await chapter.insert(); return chapter
@app.put("/api/map/{chapter_id}/status", response_model=MapChapter)
async def set_chapter_status(chapter_id: PydanticObjectId, data: dict = Body(...)):
    chapter = await MapChapter.get(chapter_id);
    if not chapter: raise HTTPException(status_code=404, detail="Chapter not found."); status = data.get("status")
    if status not in ["locked", "active", "completed"]: raise HTTPException(status_code=400, detail="Invalid status.")
    chapter.status = status; await chapter.save(); return chapter

@app.get("/api/bosses", response_model=List[Boss])
async def get_bosses(): return await Boss.find_all().to_list()
@app.post("/api/bosses", response_model=Boss)
async def create_boss(boss_data: dict = Body(...)):
    if not boss_data.get("name"): raise HTTPException(status_code=400, detail="Boss name is required.")
    boss = Boss(name=boss_data["name"], description=boss_data.get("description", "A new challenge has appeared.")); await boss.insert(); return boss
@app.put("/api/bosses/{boss_id}/defeat", response_model=Boss)
async def defeat_boss(boss_id: PydanticObjectId):
    boss = await Boss.get(boss_id);
    if not boss: raise HTTPException(status_code=404, detail="Boss not found."); boss.defeated = True; await boss.save(); return boss

@app.get("/api/inventory", response_model=List[InventoryItem])
async def get_inventory(): return await InventoryItem.find_all().to_list()
@app.post("/api/inventory", response_model=InventoryItem)
async def create_inventory_item(item_data: dict = Body(...)):
    if not item_data.get("name") or not item_data.get("type"): raise HTTPException(status_code=400, detail="Name and type are required.")
    item = InventoryItem(name=item_data["name"], type=item_data["type"], description=item_data.get("description", "Acquired.")); await item.insert(); return item
