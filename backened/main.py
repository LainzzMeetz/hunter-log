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

# --- SEEDER (FINAL LOGIC) ---
async def seed_database_logic():
    print("INITIALIZING SYSTEM: FINAL VERSION...")
    
    await Player.delete_all(); await Quest.delete_all(); await Skill.delete_all()
    await Achievement.delete_all(); await HealthMetric.delete_all(); await InventoryItem.delete_all()
    await MapChapter.delete_all(); await Boss.delete_all(); await JournalEntry.delete_all()
    print("Old data wiped.")

    # --- Player ---
    player = Player(
        username="Player",
        level=1, 
        exp=0, 
        exp_to_next_level=300, 
        stats=Stats(),
        conditions=[Condition(name="Active", type="buff", description="System Online.")],
        active_skill_track="software_dev_skill"
    )
    await player.insert()

    # --- 1. WAKE UP (Restores CLARITY) ---
    await Quest(
        title="Wake Up", 
        description="Jumpstart circadian rhythm & Plan.", 
        type="daily",
        exp_grant=10, rank="E", 
        stat_reward="willpower", stat_points=1, # Primary stat
        sub_tasks=[ 
            SubTask(title="Wake: 7:00 AM"), 
            SubTask(title="Hydrate"), 
            SubTask(title="Sun Exposure (5 min)"),
            SubTask(title="Plan the Day") # <--- Triggers Clarity Logic
        ]
    ).insert()
    
    # --- 2. FOCUS ---
    await Quest(
        title="Focus", 
        description="Deep work block. Zero distractions.", 
        type="daily",
        exp_grant=10, rank="E", 
        stat_reward="focus", stat_points=1,
        duration_minutes=15
    ).insert()
    
    # --- 3. QUICK WORKOUT ---
    await Quest(
        title="Quick Workout", 
        description="Basic maintenance movement.", 
        type="daily",
        exp_grant=20, rank="D", 
        stat_reward="strength", stat_points=1,
        duration_minutes=15
    ).insert()

    # --- 4. CARDIO ---
    await Quest(
        title="Cardio", 
        description="Heart health & endurance.", 
        type="daily",
        exp_grant=20, rank="D", 
        stat_reward="stamina", stat_points=1,
        duration_minutes=20
    ).insert()

    # --- 5. HEALTH ---
    await Quest(
        title="Health", 
        description="Biological recovery.", 
        type="daily",
        exp_grant=10, rank="E", 
        stat_reward="vitality", stat_points=1,
        sub_tasks=[ 
            SubTask(title="Sleep 7+ Hours"), 
            SubTask(title="Clean Meal")
        ]
    ).insert()

    # --- 6. STUDY (Dynamic Title handled in Frontend) ---
    await Quest(
        title="Study", 
        description="Skill acquisition.", 
        type="daily",
        exp_grant=30, rank="C", 
        stat_reward="study", stat_points=2, 
        duration_minutes=0 
    ).insert()

    # --- 7. GROOMING ---
    await Quest(
        title="Grooming", 
        description="Social presentation.", 
        type="daily",
        exp_grant=10, rank="E", 
        stat_reward="confidence", stat_points=1,
        sub_tasks=[ 
            SubTask(title="Hygiene"), 
            SubTask(title="Dress Well") 
        ]
    ).insert()

    # --- INITIAL ROADMAP ---
    await MapChapter(chapter=1, title="The Foundation", description="Establish the routine.", status="active").insert()
    await MapChapter(chapter=2, title="System Construction", description="Build the tool.", status="locked").insert()

    print("--- SYSTEM READY ---")
    return {"message": "System Reset. Rank System Active."}


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
    player = await Player.find_one(Player.username == "Player")
    if not player: raise HTTPException(status_code=404, detail="Player not found.")
    return player

@app.get("/")
async def root():
    return {"message": "Hunter's Log: [System Core Online]"}

@app.get("/api/system/reset")
async def system_reset():
    return await seed_database_logic()

@app.get("/api/player", response_model=Player)
async def get_player(): return await get_player_instance()

@app.put("/api/player/set-track", response_model=Player)
async def set_active_track(data: dict = Body(...)):
    player = await get_player_instance(); track_name = data.get("track")
    if not hasattr(player.stats, track_name): raise HTTPException(status_code=400, detail="Invalid skill track name.")
    player.active_skill_track = track_name; await player.save(); return player

# --- LEVEL & PENALTY LOGIC ---
def calculate_level_up(player, exp_change):
    player.exp += exp_change
    # Level Up
    while player.exp >= player.exp_to_next_level:
        player.level += 1
        player.exp -= player.exp_to_next_level
        player.exp_to_next_level = int(player.exp_to_next_level * 1.5)
    
    # Level Down (Penalty) logic
    if player.exp < 0:
        if player.level > 1:
            player.level -= 1
            player.exp_to_next_level = int(player.exp_to_next_level / 1.5)
            player.exp = player.exp_to_next_level + player.exp
        else:
            player.exp = 0 # Safety floor
            
    return player

@app.put("/api/quests/{quest_id}/achieve", response_model=Player)
async def achieve_main_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id);
    if not quest or quest.completed: return await get_player_instance()
    if quest.type == "daily": raise HTTPException(status_code=400, detail="Cannot manually achieve a Daily Quest.")
    
    quest.completed = True; await quest.save(); player = await get_player_instance()
    if quest.stat_reward and quest.stat_points > 0:
        current_stat_val = getattr(player.stats, quest.stat_reward, 1); setattr(player.stats, quest.stat_reward, current_stat_val + quest.stat_points)
    
    player = calculate_level_up(player, quest.exp_grant)
    await player.save(); return player

@app.get("/api/quests", response_model=List[Quest])
async def get_quests(type: str = None):
    if type: return await Quest.find(Quest.type == type).to_list()
    return await Quest.find_all().to_list()

@app.get("/api/quests/{quest_id}", response_model=Quest)
async def get_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id)
    if not quest: raise HTTPException(status_code=404, detail="Quest not found")
    return quest

@app.put("/api/quests/{quest_id}/subtask/{sub_task_title}", response_model=Player)
async def toggle_sub_task(quest_id: PydanticObjectId, sub_task_title: str):
    quest = await Quest.get(quest_id)
    if not quest: raise HTTPException(status_code=404, detail="Quest not found.")
    if quest.completed: return await get_player_instance()
    task_found = False; all_tasks_complete = True
    for task in quest.sub_tasks:
        if task.title == sub_task_title:
            task.completed = not task.completed; task_found = True
        if not task.completed: all_tasks_complete = False
    if not task_found: raise HTTPException(status_code=404, detail="Sub-task not found.")
    
    if all_tasks_complete:
        quest.completed = True; await quest.save(); player = await get_player_instance()
        
        # Reward Logic
        if quest.title == "Wake Up":
            # Special case: Wake Up gives Willpower AND Clarity
            player.stats.willpower += 1
            player.stats.clarity += 1
        elif quest.stat_reward and quest.stat_points > 0:
            current_stat_val = getattr(player.stats, quest.stat_reward, 1)
            setattr(player.stats, quest.stat_reward, current_stat_val + quest.stat_points)
            
        player = calculate_level_up(player, quest.exp_grant)
        await player.save(); return player
    else:
        await quest.save(); return await get_player_instance()

@app.put("/api/quests/{quest_id}/complete", response_model=Player)
async def complete_quest(quest_id: PydanticObjectId):
    quest = await Quest.get(quest_id);
    if not quest or quest.completed: return await get_player_instance()
    if quest.sub_tasks: raise HTTPException(status_code=400, detail="This quest must be completed via its sub-tasks.")
    
    quest.completed = True; await quest.save(); player = await get_player_instance()
    
    # Handle Study Rewards Dynamic
    if quest.stat_reward == "study":
        track = player.active_skill_track
        current_stat_val = getattr(player.stats, track, 1)
        setattr(player.stats, track, current_stat_val + quest.stat_points)
    elif quest.stat_reward and quest.stat_points > 0:
        current_stat_val = getattr(player.stats, quest.stat_reward, 1)
        setattr(player.stats, quest.stat_reward, current_stat_val + quest.stat_points)
        
    player = calculate_level_up(player, quest.exp_grant)
    await player.save(); return player

# --- NEW DAY ENDPOINT (WITH SAFETY NET) ---
@app.post("/api/dailies/new-day")
async def start_new_day():
    daily_quests = await Quest.find(Quest.type == "daily").to_list()
    player = await get_player_instance()
    
    missed_count = 0
    penalty_per_miss = 5
    
    for quest in daily_quests:
        if not quest.completed: missed_count += 1
        quest.completed = False
        if quest.sub_tasks:
            for task in quest.sub_tasks: task.completed = False
        await quest.save()
        
    # PENALTY LOGIC WITH SAFETY NET
    if missed_count > 0:
        # If Player is Level 1-9 (E-Rank), NO PENALTY.
        if player.level < 10:
             return {"message": f"Day Reset. {missed_count} missed. (No Penalty for E-Rank)."}
        else:
             total_penalty = missed_count * penalty_per_miss
             player = calculate_level_up(player, -total_penalty) 
             await player.save()
             return {"message": f"Day Reset. {missed_count} missed. Penalty: -{total_penalty} EXP."}
             
    return {"message": "Day Reset. All tasks done."}

# --- Data Endpoints (Standard) ---
@app.get("/api/journal", response_model=List[JournalEntry])
async def get_journal_entries(): return await JournalEntry.find_all().sort("-date").to_list()
@app.post("/api/journal", response_model=JournalEntry)
async def create_journal_entry(entry_data: dict = Body(...)):
    entry = JournalEntry(category=entry_data["category"], content=entry_data["content"]); await entry.insert(); return entry
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(): return await Skill.find_all().to_list()
@app.post("/api/skills", response_model=Skill)
async def add_skill(new_skill: dict = Body(...)):
    skill_entry = Skill(name=new_skill["name"].strip(), tree=new_skill.get("tree", "general"), description=new_skill.get("description", "")); await skill_entry.insert(); return skill_entry
@app.get("/api/achievements", response_model=List[Achievement])
async def get_achievements(): return await Achievement.find_all().to_list()
@app.get("/api/map", response_model=List[MapChapter])
async def get_map(): return await MapChapter.find().sort("chapter").to_list()
@app.post("/api/map", response_model=MapChapter)
async def create_map_chapter(data: dict = Body(...)):
    existing = await MapChapter.find_all().to_list(); next_ch = max([c.chapter for c in existing], default=0) + 1
    ch = MapChapter(chapter=next_ch, title=data["title"], description=data["description"], status="locked"); await ch.insert(); return ch
@app.put("/api/map/{chapter_id}/status", response_model=MapChapter)
async def set_chapter_status(chapter_id: PydanticObjectId, data: dict = Body(...)):
    ch = await MapChapter.get(chapter_id); ch.status = data.get("status"); await ch.save(); return ch
@app.get("/api/bosses", response_model=List[Boss])
async def get_bosses(): return await Boss.find_all().to_list()
@app.post("/api/bosses", response_model=Boss)
async def create_boss(data: dict = Body(...)):
    boss = Boss(name=data["name"], description=data.get("description", "")); await boss.insert(); return boss
@app.put("/api/bosses/{boss_id}/defeat", response_model=Boss)
async def defeat_boss(boss_id: PydanticObjectId):
    boss = await Boss.get(boss_id); boss.defeated = True; await boss.save(); return boss
@app.get("/api/inventory", response_model=List[InventoryItem])
async def get_inventory(): return await InventoryItem.find_all().to_list()
@app.post("/api/inventory", response_model=InventoryItem)
async def create_inventory_item(data: dict = Body(...)):
    item = InventoryItem(name=data["name"], type=data["type"], description=data.get("description", "")); await item.insert(); return item
