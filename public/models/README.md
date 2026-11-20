# Models

Put `.glb` files here, then reference them by filename in `src/content.js`:

- **Character:** set `CHARACTER_MODEL = 'character.glb'`. Animation clips whose names contain `walk`/`run` and `idle`/`stand` are picked up automatically.
- **Buildings:** add `model: 'workshop.glb'` to any project (or `ABOUT`).

Models are auto-scaled (the character to about 1.7 units tall, buildings to about 2.6) and placed with their base on the ground, facing +Z (toward the path). If a file fails to load, the placeholder stays.
