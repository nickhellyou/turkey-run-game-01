// Gobble or Gone — tuning constants. One job: every number the game plays by.
export const VIEW_W = 1280;
export const VIEW_H = 720;
export const GROUND_Y = 600;
export const TURKEY_X = 300;
export const GOAL_M = 1500;

export const GRAVITY = 2600;
export const JUMP_V = -980;
export const BASE_SPEED = 380;
export const MAX_SPEED = 740;
export const SPEED_PER_100M = 14;

export const STAGES = [
  { name: 'FARMYARD', from: 0, to: 500, sky: ['#ffd98a', '#ffb347'], ground: '#c98f4e', grass: '#7fae4c' },
  { name: 'CORNFIELD', from: 500, to: 1000, sky: ['#ffc46b', '#ff9e57'], ground: '#b57e3e', grass: '#e0a83c' },
  { name: 'THE KITCHEN', from: 1000, to: 1500, sky: ['#ff9d5c', '#e2583e'], ground: '#8a4a2f', grass: '#a34a2a' },
];

export const SCORES = { corn: 50, feather: 150, cleanJump: 25, escape: 1000, perMetre: 1 };
export const START_LIVES = 3;
export const FARMER_GAP_START = 260;
export const FARMER_GAP_MAX = 430;
