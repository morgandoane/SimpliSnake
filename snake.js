const foodEmojis = [
	'🍎',
	'🍊',
	'🍉',
	'🍇',
	'🍓',
	'🍌',
	'🍍',
	'🥭',
	'🥝',
	'🍒',
	'🍑',
	'🥥',
	'🥑',
	'🥦',
	'🥕',
	'🌽',
	'🌶️',
	'🍔',
	'🍕',
	'🌮',
	'🌯',
	'🍣',
	'🍤',
	'🍜',
	'🍝',
	'🍲',
	'🥗',
	'🥙',
	'🍩',
	'🍪',
	'🎂',
	'🍦',
	'🍫',
	'🍿',
	'🥤',
	'🍷',
	'🍺',
	'🥂',
	'☕',
	'🍵',
];

const getFoodEmoji = () =>
	foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

class Snake {
	constructor(gridSize = 20) {
		this.gridSize = gridSize;
		this.nodes = [[Math.floor(gridSize / 2), Math.floor(gridSize / 2)]];
		this.direction = 'right';
		this.food = this.generateFood();
		this.speed = 125;
		this.mode = localStorage.getItem('mode') || 'easy';
		this.interval = null;

		this.createGrid();
		this.setGameLoop();
	}

	createGrid() {
		const root = document.getElementById('root');
		for (let row = 0; row < this.gridSize; row++) {
			const rowElement = document.createElement('div');
			rowElement.className = 'row';

			for (let col = 0; col < this.gridSize; col++) {
				const cell = document.createElement('div');
				cell.className = 'cell';
				cell.id = `${row}-${col}`;
				rowElement.appendChild(cell);
			}
			root.appendChild(rowElement);
		}
	}

	changeDirection(direction) {
		if (direction !== this.direction) {
			this.direction = direction;
			this.move();
			this.render();
		}
	}

	changeMode(mode) {
		this.mode = mode;
		this.speed = { easy: 125, medium: 75, hard: 40 }[mode];
		clearInterval(this.interval);
		this.setGameLoop();
	}

	setGameLoop() {
		this.interval = setInterval(() => {
			this.move();
			this.render();
		}, this.speed);
	}

	generateFood() {
		let foodPosition;
		do {
			foodPosition = [
				Math.floor(Math.random() * this.gridSize),
				Math.floor(Math.random() * this.gridSize),
				getFoodEmoji(),
			];
		} while (
			this.nodes.some(
				(node) => node[0] === foodPosition[0] && node[1] === foodPosition[1]
			)
		);
		return foodPosition;
	}

	render() {
		document.querySelectorAll('.dot').forEach((dot) => dot.remove());

		this.nodes.forEach(([x, y]) => {
			const dot = document.createElement('div');
			dot.className = 'dot';
			document.getElementById(`${y}-${x}`).appendChild(dot);
		});

		if (!document.querySelector('.food')) {
			const foodElement = document.createElement('div');
			foodElement.className = 'food';
			foodElement.innerHTML = this.food[2];
			document
				.getElementById(`${this.food[1]}-${this.food[0]}`)
				.appendChild(foodElement);
		}
	}

	move() {
		const [x, y] = this.nodes[0];
		const newHead = {
			up: [x, (y - 1 + this.gridSize) % this.gridSize],
			down: [x, (y + 1) % this.gridSize],
			left: [(x - 1 + this.gridSize) % this.gridSize, y],
			right: [(x + 1) % this.gridSize, y],
		}[this.direction];

		if (
			this.nodes.some(
				(node) => node[0] === newHead[0] && node[1] === newHead[1]
			)
		) {
			this.endGame();
		} else if (newHead[0] === this.food[0] && newHead[1] === this.food[1]) {
			this.nodes.unshift(newHead);
			this.food = this.generateFood();
			document.querySelector('.food').remove();
		} else {
			this.nodes = [newHead, ...this.nodes.slice(0, -1)];
		}
	}

	endGame() {
		clearInterval(this.interval);
		alert('Game Over!');
		const restartButton = document.createElement('button');
		restartButton.innerHTML = 'Restart';
		restartButton.style.position = 'absolute';
		restartButton.style.top = '50%';
		restartButton.style.left = '50%';
		restartButton.style.transform = 'translate(-50%, -50%)';
		restartButton.onclick = () => window.location.reload();
		document.getElementById('root').appendChild(restartButton);
	}
}

const snake = new Snake();

document.addEventListener('keydown', (event) => {
	const validDirections = {
		ArrowUp: 'up',
		ArrowDown: 'down',
		ArrowLeft: 'left',
		ArrowRight: 'right',
	};

	if (validDirections[event.key]) {
		const oppositeDirections = {
			up: 'down',
			down: 'up',
			left: 'right',
			right: 'left',
		};

		if (snake.direction !== oppositeDirections[validDirections[event.key]]) {
			snake.changeDirection(validDirections[event.key]);
		}
	}
});

const controlContainer = document.getElementById('controls');
if (controlContainer) {
	const modes = ['easy', 'medium', 'hard'];
	modes.forEach((mode) => {
		const button = document.createElement('button');
		button.innerHTML = mode;
		if (mode === snake.mode)
			button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
		button.onclick = () => {
			snake.changeMode(mode);
			localStorage.setItem('mode', mode);
			document
				.querySelectorAll('#controls button')
				.forEach((b) => (b.style.backgroundColor = ''));
			button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
		};
		controlContainer.appendChild(button);
	});
}
