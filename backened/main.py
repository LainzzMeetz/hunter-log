# backend/main.py
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie, PydanticObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from pydantic import BaseModel  # <--- ADDED THIS IMPORT
from typing import List, Optional
from datetime import datetime

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

# --- SEEDER ---
async def seed_database_logic():
    print("INITIALIZING SYSTEM: INFINITE STUDY MODE...")
    
    await Player.delete_all(); await Quest.delete_all(); await Skill.delete_all()
    await Achievement.delete_all(); await MapChapter.delete_all(); await Boss.delete_all()
    
    # Player Initialization (Now correctly includes daily_study_points)
    player = Player(
        username="Player",
        level=1, 
        exp=0, 
        exp_to_next_level=300, 
        stats=Stats(),
        active_skill_track="software_dev_skill",
        daily_study_points=0 
    )
    await player.insert()

    # 1. WAKE UP (+Clarity)
    await Quest(
        title="Wake Up", 
        description="Jumpstart circadian rhythm & Plan.", 
        type="daily",
        exp_grant=10, 
        stat_reward="willpower", stat_points=1,
        sub_tasks=[ 
            SubTask(title="Wake: 7:00 AM"), 
            SubTask(title="Hydrate"), 
            SubTask(title="Sun Exposure (5 min)"),
            SubTask(title="Plan the Day")
        ]
    ).insert()
    
    # 2. FOCUS
    await Quest(title="Focus", description="Deep work block.", type="daily", exp_grant=10, stat_reward="focus", stat_points=1, duration_minutes=15).insert()
    
    # 3. QUICK WORKOUT
    await Quest(title="Quick Workout", description="Maintenance movement.", type="daily", exp_grant=20, stat_reward="strength", stat_points=1, duration_minutes=15).insert()

    # 4. CARDIO
    await Quest(title="Cardio", description="Heart health.", type="daily", exp_grant=20, stat_reward="stamina", stat_points=1, duration_minutes=20).insert()

    # 5. HEALTH
    await Quest(title="Health", description="Recovery.", type="daily", exp_grant=10, stat_reward="vitality", stat_points=1, sub_tasks=[ SubTask(title="Sleep 7+ Hours"), SubTask(title="Clean Meal")]).insert()

    # 6. STUDY (Infinite Type)
    await Quest(
        title="Study", 
        description="Log your skill acquisition sessions.", 
        type="daily",
        exp_grant=0, # Dynamic
        stat_reward="study", 
        stat_points=0
    ).insert()

    # 7. GROOMING
    await Quest(title="Grooming", description="Presentation.", type="daily", exp_grant=10, stat_reward="confidence", stat_points=1, sub_tasks=[ SubTask(title="Hygiene"), SubTask(title="Dress Well")]).insert()

    # MAP
    await MapChapter(chapter=1, title="The Foundation", description="Establish the routine.", status="active").insert()
    await MapChapter(chapter=2, title="System Construction", description="Build the tool.", status="locked").insert()

    return {"message": "System Reset. Infinite Study Mode Active."}

@app.on_event("startup")
async def on_startup():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(database=client.hunters_log_db, document_models=[Player, Quest, Skill, Achievement, HealthMetric, InventoryItem, MapChapter, Boss, JournalEntry])
    print("Connected.")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

async def get_player_instance():
    player = await Player.find_one(Player.username == "Player")
    if not player: raise HTTPException(status_code=404, detail="Player not found.")
    return player

# --- LOGIC ---
def calculate_level_up(player, exp_change):
    player.exp += exp_change
    while player.exp >= player.exp_to_next_level:
        player.level += 1
        player.exp -= player.exp_to_next_level
        player.exp_to_next_level = int(player.exp_to_next_level * 1.5)
    
    if player.exp < 0:
        if player.level > 1:
            player.level -= 1
            player.exp_to_next_level = int(player.exp_to_next_level / 1.5)
            player.exp = player.exp_to_next_level + player.exp
        else:
            player.exp = 0
    return player

# --- NEW DATA MODEL FOR EMERGENCY SYSTEM ---
class EmergencyRequest(BaseModel):
    username: str
    energy_type: str
    xp_reward: int

# --- ENDPOINTS ---
@app.get("/api/player", response_model=Player)
async def get_player(): return await get_player_instance()

# --- NEW ENDPOINT FOR SIN TRANSMUTATION ---
@app.post("/api/emergency/complete")
async def complete_emergency(request: EmergencyRequest):
    # 1. Find the player (Try the sent username, fallback to "Player")
    player = await Player.find_one(Player.username == request.username)
    if not player:
        player = await Player.find_one(Player.username == "Player")
    
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")

    # 2. Use the existing logic to calculate level ups safely
    player = calculate_level_up(player, request.xp_reward)
    
    # 3. Save to Database
    await player.save()

    return {"status": "SUCCESS", "new_xp": player.exp, "new_level": player.level}

@app.put("/api/player/set-track", response_model=Player)
async def set_active_track(data: dict = Body(...)):
    player = await get_player_instance()
    # Ensure stat exists, if not create it dynamically
    track = data.get("track")
    if not hasattr(player.stats, track): 
        setattr(player.stats, track, 1) # Initialize if missing
    
    player.active_skill_track = track
    await player.save()
    return player

@app.get("/api/quests", response_model=List[Quest])
async def get_quests(): return await Quest.find_all().to_list()

@app.put("/api/quests/{quest_id}/subtask/{sub_task_title}", response_model=Player)
async def toggle_sub_task(quest_id: PydanticObjectId, sub_task_title: str):
    quest = await Quest.get(quest_id)
    if not quest: raise HTTPException(404)
    
    task_found = False; all_complete = True
    for task in quest.sub_tasks:
        if task.title == sub_task_title:
            task.completed = not task.completed
            task_found = True
        if not task.completed: all_complete = False
        
    await quest.save()
    
    if all_complete:
        player = await get_player_instance()
        quest.completed = True
        await quest.save()
        
        # Rewards
        if quest.title == "Wake Up":
            player.stats.willpower += 1
            player.stats.clarity += 1
        elif quest.stat_reward and quest.stat_points > 0:
            val = getattr(player.stats, quest.stat_reward, 1)
            setattr(player.stats, quest.stat_reward, val + quest.stat_points)
            
        player = calculate_level_up(player, quest.exp_grant)
        await player.save()
        return player
        
    return await get_player_instance()

@app.put("/api/quests/{quest_id}/complete", response_model=Player)
async def complete_quest(quest_id: PydanticObjectId, data: dict = Body(default={})):
    quest = await Quest.get(quest_id)
    player = await get_player_instance()
    
    # --- SPECIAL LOGIC FOR STUDY ---
    if quest.title == "Study":
        points_to_log = data.get("points", 1)
        if points_to_log < 1 or points_to_log > 5:
             raise HTTPException(400, "Points must be between 1 and 5.")
        
        if player.daily_study_points + points_to_log > 10:
             raise HTTPException(400, "Daily cognitive limit reached (Max 10 pts/day).")
             
        track = player.active_skill_track
        # Ensure stat exists
        current_val = getattr(player.stats, track, 1)
        setattr(player.stats, track, current_val + points_to_log)
        
        player.daily_study_points += points_to_log
        
        # Grant EXP (15 EXP per point)
        player = calculate_level_up(player, points_to_log * 15)
        
        await player.save()
        return player

    # --- STANDARD QUEST LOGIC ---
    quest.completed = True; await quest.save()
    if quest.stat_reward and quest.stat_points > 0:
        val = getattr(player.stats, quest.stat_reward, 1)
        setattr(player.stats, quest.stat_reward, val + quest.stat_points)
    player = calculate_level_up(player, quest.exp_grant)
    await player.save()
    return player

@app.post("/api/dailies/new-day")
async def start_new_day():
    daily_quests = await Quest.find(Quest.type == "daily").to_list()
    player = await get_player_instance()
    
    missed = 0
    for q in daily_quests:
        if q.title != "Study" and not q.completed:
            missed += 1
        q.completed = False
        if q.sub_tasks:
            for t in q.sub_tasks: t.completed = False
        await q.save()
        
    player.daily_study_points = 0
    
    if missed > 0 and player.level >= 10:
        player = calculate_level_up(player, -(missed * 5))
        
    await player.save()
    return {"message": "Day Reset."}

# --- OTHER ROUTES ---
@app.get("/api/system/reset")
async def system_reset(): return await seed_database_logic()
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(): return await Skill.find_all().to_list()
@app.post("/api/skills", response_model=Skill)
async def add_skill(d: dict = Body(...)): 
    s = Skill(name=d["name"], tree=d["tree"]); await s.insert(); return s
@app.get("/api/map", response_model=List[MapChapter])
async def get_map(): return await MapChapter.find().sort("chapter").to_list()
@app.post("/api/map", response_model=MapChapter)
async def add_map(d: dict = Body(...)):
    existing = await MapChapter.find_all().to_list(); next_ch = max([c.chapter for c in existing], default=0) + 1
    c = MapChapter(chapter=next_ch, title=d["title"], description=d["description"], status="locked"); await c.insert(); return c
@app.put("/api/map/{id}/status", response_model=MapChapter)
async def set_map_status(id: PydanticObjectId, d: dict = Body(...)):
    c = await MapChapter.get(id); c.status = d["status"]; await c.save(); return c
@app.get("/api/bosses", response_model=List[Boss])
async def get_bosses(): return await Boss.find_all().to_list()
@app.post("/api/bosses", response_model=Boss)
async def add_boss(d: dict = Body(...)):
    b = Boss(name=d["name"], description=d.get("description")); await b.insert(); return b
@app.put("/api/bosses/{id}/defeat", response_model=Boss)
async def defeat_boss(id: PydanticObjectId):
    b = await Boss.get(id); b.defeated = True; await b.save(); return b
