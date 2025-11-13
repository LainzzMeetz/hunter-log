# backend/seed.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from beanie import init_beanie
import datetime

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

async def seed_database():
    print("Connecting to database...")
    client = AsyncIOMotorClient(settings.DATABASE_URL)
    await init_beanie(database=client.hunters_log_db, document_models=[
        Player, Quest, Skill, Achievement, HealthMetric, 
        InventoryItem, MapChapter, Boss, JournalEntry
    ])
    print("Database connected. Clearing old data for v11.4 re-seed (Clean Slate)...")

    # --- CLEAR ALL DATA ---
    await Player.delete_all(); await Quest.delete_all(); await Skill.delete_all()
    await Achievement.delete_all(); await HealthMetric.delete_all(); await InventoryItem.delete_all()
    await MapChapter.delete_all(); await Boss.delete_all(); await JournalEntry.delete_all()
    print("Old data cleared.")

    # --- Player (Clean Slate) ---
    player = Player(
        username="Laingam",
        level=1, exp=0, stats=Stats(),
        conditions=[
            Condition(name="Emotional Damage", type="debuff", description="Healing in progress."),
            Condition(name="Mental Fog", type="debuff", description="Recovery in progress."),
        ],
        active_skill_track="software_dev_skill"
    )
    await player.insert()

    # --- CORE QUESTS (The only things that should be pre-populated) ---
    await Quest(
        title="Morning Routine", description="Complete your morning ritual...", type="daily",
        exp_grant=10, rank="D", stat_reward="willpower", stat_points=1,
        sub_tasks=[ SubTask(title="Wake at 7:00 AM"), SubTask(title="Drink 500ml Water"), SubTask(title="5-min Stretch") ]
    ).insert()
    
    await Quest(
        title="Meditate", description="5-10 minutes of focused breathing.", type="daily",
        exp_grant=10, rank="D", stat_reward="focus", stat_points=1, duration_minutes=10
    ).insert()
    
    await Quest(
        title="Workout", description="15–45 min exercise.", type="daily",
        exp_grant=20, rank="C", stat_reward="strength", stat_points=1, duration_minutes=20
    ).insert()
    
    await Quest(
        title="Study/Skill Practice", description="1–2 hrs.", type="daily",
        exp_grant=25, rank="C", stat_reward="study", stat_points=1, duration_minutes=90
    ).insert()
    
    await Quest(
        title="Apply for 5 Jobs", description="Complete 5 job applications.", type="weekly",
        exp_grant=100, rank="B", stat_reward="career", stat_points=2
    ).insert()

    await Quest(
        title="Reawakening", description="Stabilize routine, heal heart, rebuild confidence.", type="main",
        exp_grant=500, rank="A"
    ).insert()
    
    # --- SKILL TREES (Add minimal set required for logic) ---
    await Skill(name="MCU Basics", tree="embedded", description="Core STM32/ARM concepts.").insert()
    await Skill(name="Python Refresher", tree="ai_ml", description="Data structures and syntax.").insert()
    await Skill(name="Qiskit Basics", tree="quantum", description="Running circuits on qBraid/IBM.").insert()
    await Skill(name="Python (FastAPI)", tree="software_dev", description="Building backend APIs.").insert()

    print("--- DATABASE SEEDING v11.4 COMPLETE (Clean Slate) ---")
    print("Only core quests and initial skills remain. Frontend should now show data.")

if __name__ == "__main__":
    asyncio.run(seed_database())