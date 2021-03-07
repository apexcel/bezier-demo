const createElement = (elemType, options) => {
    const elem = document.createElement(elemType);
    if (options) {
        for (const [attr, value] of Object.entries(options)) {
            if (attr === 'className') {
                (Array.isArray(value))
                    ? value.forEach(className => elem.classList.add(className))
                    : elem.classList.add(value);
            }
            else {
                elem[attr] = value;
            }
        }
    }
    return elem;
};

const attachStyleSheet = (url) => {
    const css = createElement('link', {
        rel: 'stylesheet',
        type: 'text/css',
        href: url
    })
    document.head.appendChild(css);
};

const getMousePosition = (canvas, ev) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (ev.offsetX - rect.left) * scaleX,
        y: (ev.offsetY - rect.top) * scaleY
    };
};

//TODO: 원리 이해하기
const blend = (p1, p2, t) => {
    if (t > 1 || t < 0) return 0;
    if (t === 0) return p1;
    if (t === 1) return p2;
    return ((1 - t) * p1) + (t * p2);
};

// TODO: 동작 방식 확인 하기
const interpolation = (x1, x2, y1, y2, duration) => {
    return (update) => {
        const blendX = blend.bind(null, x1, x2);
        const blendY = blend.bind(null, y1, y2);
        let startTime = 0;

        const step = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            const pastTime = timestamp - startTime;
            let progress = pastTime / duration;

            if (progress > 1) {
                update(blendX(1), blendY(1));
                return;
            }

            update(blendX(progress), blendY(progress));
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
};
export { createElement, attachStyleSheet, getMousePosition, interpolation };