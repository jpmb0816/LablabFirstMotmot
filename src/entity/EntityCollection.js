class EntityCollection {
	constructor() {
		this.data = [];
		this.order = [];
	}

	sortbyYOrder() {
		const len = this.order.length - 1;

		for (let i = len; i >= 0; i--) {
			const a = this.order[i];

			if (a.redundant && !(a instanceof Player)) {
				this.removeData(a);
				this.removeOrder(i);
				continue;
			}

			if (i > 0) {
				for (let j = 0; j < i; j++) {
					const b = this.order[j];

					if (b.cy < a.cy && b.cy + b.h > a.cy + a.h ||
						b.cy > a.cy && b.cy + b.h > a.cy + a.h) {
						
						const temp = this.order[i];
						this.order[i] = this.order[j];
						this.order[j] = temp;
					}
				}
			}
		}
	}

	drawAll() {
		const pl = Math.round(player.l);
		const pt = Math.round(player.t);

		this.order.forEach(e => {
			if (e.cx < camera.x + camera.cw && e.cx + e.w > camera.x &&
				e.cy < camera.y + camera.ch && e.cy + e.h > camera.y) {

				e.draw();
			}

			if (map.wireframe) {
				const el = Math.round(e.l);
				const er = Math.round(e.r);
				const et = Math.round(e.t);
				const eb = Math.round(e.b);
				c.strokeRect(el, et, er - el, eb - et);

				if (!(e instanceof Player)) {
					c.font = '20px Arial';
					c.fillText(round2D(getDistance({ x: el, y: et }, { x: pl, y: pt })), el, et);

					c.beginPath();
					c.moveTo(pl, pt);
					c.lineTo(e.l, e.t);
					c.stroke();
				}
			}
			e.update();
		});
	}

	add(object) {
		this.data.push(object);
		this.order.push(object);
	}
	
	addAll(objects) {
		objects.forEach(obj => this.add(obj));
	}

	getId(name) {
		const entities = this.data;
		for (let i = entities.length - 1; i >= 0; i--) {
			if (entities[i].name === name) return i;
		}
		return -1;
	}

	getEntity(id) {
		if (!Number.isInteger(id)) id = this.getId(id);
		return this.data[id];
	}

	removeData(d) {
		const data = this.data;
		const len = data.length;

		for (let i = 0; i < len; i++) {
			if (this.data[i] === d) {
				this.data.splice(i, 1);
				return;
			}
		}
	}

	removeOrder(id) {
		this.order.splice(id, 1);
	}
}