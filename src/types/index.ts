export interface Client {
  id: string;
  name: string;
  age: number;
  height: number; // cm
  startingWeight: number; // kg
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced';
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  injuryHistory: string;
  smoking: boolean;
  alcohol: boolean;
  sleepHours: number;
  profileImage?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  clientId: string;
  date: Date;
  quickCheckIn: {
    painLevel: number; // 1-10
    sleepQuality: number; // 1-10
    generalCondition: string;
  };
  bodyComposition: {
    weight: number; // kg
    bodyFat: number; // %
    muscleMass: number; // %
  };
  measurements: {
    waist: number; // cm
    hips: number; // cm
    chest: number; // cm
    thigh: number; // cm
    arm: number; // cm
    calf?: number; // cm
    shoulders?: number; // cm
  };
  mobility: {
    hip: MobilityTest[];
    shoulder: MobilityTest[];
    ankle: MobilityTest[];
    thoracic: MobilityTest[];
  };
  stability: StabilityTest[];
  strength: StrengthTest[];
  benchmarks: StrengthBenchmark[];
  photos: {
    front: string;
    side: string;
    back: string;
  };
}

export interface MobilityTest {
  exercise: string;
  description: string;
  result: number; // cm or degrees
  notes?: string;
}

export interface StabilityTest {
  exercise: string;
  description: string;
  result: string; // time or rating
  notes?: string;
}

export interface StrengthTest {
  exercise: string;
  description: string;
  weight: number; // kg
  reps: number;
  notes?: string;
}

export interface StrengthBenchmark {
  exercise: 'push-up' | 'pull-up' | 'bench-press' | 'squat' | 'deadlift' | 'military-press';
  weight: number; // kg
  reps: number;
  score: number;
}
