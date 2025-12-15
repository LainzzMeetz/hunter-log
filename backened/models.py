# backend/models.py
from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- AUXILIARY MODELS ---
class Stats(BaseModel):
    strength: int = 1
    stamina: int = 1
    vitality: int = 1
    focus: int = 1
    clarity: int = 1
    willpower: int = 1
    confidence: int = 1
    # Dynamic skill mastery tracks
    software_dev_skill: int = 1
    ai_ml_skill: int = 1
    embedded_skill: int = 1
    quantum_computing: int = 1  # Updated from cybersecurity
    
    class Config:
        extra = "allow" # Allows adding new tracks dynamically

class Condition(BaseModel):
    name: str
    type: str # 'buff' or 'debuff'
    description: str
    duration_minutes: Optional[int] = None

class SubTask(BaseModel):
    title: str
    completed: bool = False

# --- MAIN DATABASE DOCUMENTS ---
class Player(Document):
    username: str
    level: int = 1
    exp: int = 0
    exp_to_next_level: int = 300
    stats: Stats = Stats()
    conditions: List[Condition] = []
    active_skill_track: str = "software_dev_skill"
    # NEW FIELD FOR INFINITE STUDY
    daily_study_points: int = 0 

    class Settings:
        name = "players"

class Quest(Document):
    title: str
    description: str
    type: str = "daily" # daily, main, sudden
    exp_grant: int
    rank: str = "E"
    stat_reward: Optional[str] = None
    stat_points: int = 0
    duration_minutes: int = 0
    completed: bool = False
    sub_tasks: List[SubTask] = []
    
    class Settings:
        name = "quests"

class Skill(Document):
    name: str
    tree: str # e.g. "software_dev", "strength"
    description: str
    acquired_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "skills"

class Achievement(Document):
    title: str
    description: str
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "achievements"

class HealthMetric(Document):
    date: datetime = Field(default_factory=datetime.utcnow)
    type: str # sleep_hours, calories, etc
    value: float
    
    class Settings:
        name = "health_metrics"

class InventoryItem(Document):
    name: str
    type: str # consumable, equipment
    description: str
    quantity: int = 1
    
    class Settings:
        name = "inventory"

class MapChapter(Document):
    chapter: int
    title: str
    description: str
    status: str = "locked" # locked, active, completed
    
    class Settings:
        name = "map_chapters"

class Boss(Document):
    name: str
    description: str
    defeated: bool = False
    
    class Settings:
        name = "bosses"

class JournalEntry(Document):
    date: datetime = Field(default_factory=datetime.utcnow)
    category: str
    content: str
    
    class Settings:
        name = "journal"
