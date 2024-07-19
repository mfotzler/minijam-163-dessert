export const GAME_CONFIG = {
	//how long a game lasts in seconds
	GAME_TIME: 60,
	//the thresholds for when to move up to a larger ball sprite
	BALL_SIZE_THRESHOLD_SMALL: 0,
	BALL_SIZE_THRESHOLD_MEDIUM: 1.5,
	BALL_SIZE_THRESHOLD_LARGE: 2.0,
	//Default 'scale' value for the ball, which is used for scoring
	//and determining when to "grow" the ball sprite
	INITIAL_BALL_SCALE: 1,
	//the base number of points a goal is worth
	GOAL_SCORE_BASE: 1000,
	//how many points each .1 scale above the initial ball scale is worth
	//(used in conjunction with COIN_GROWTH_FACTOR to determine how much each
	// coin is worth)
	GOAL_SCORE_SCALE_MULTIPLIER: 500,
	//How much the ball scale should increase when picking up a coin
	COIN_GROWTH_FACTOR: 0.1,
	//starting coordinates for the controllable character
	BLOWER_SAN_STARTING_X: 200,
	BLOWER_SAN_STARTING_Y: 600,
	//starting coordinates for the ball
	BALL_STARTING_X: 600,
	BALL_STARTING_Y: 605,
	//the score to win the game with
	GAME_WIN_SCORE: 20000
};
