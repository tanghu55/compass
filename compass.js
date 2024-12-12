class Compass {
    constructor() {
        this.arrow = document.querySelector('.compass-arrow');
        this.directionText = document.querySelector('.direction');
        this.baguaRing = document.querySelector('.bagua-ring');
        this.tianganRing = document.querySelector('.tiangan-ring');
        this.dizhiRing = document.querySelector('.dizhi-ring');
        this.mountainsRing = document.querySelector('.mountains-ring');
        
        this.setupRings();
        this.initCompass();
    }

    setupRings() {
        // 八卦
        const bagua = ['坎', '艮', '震', '巽', '离', '坤', '兑', '乾'];
        this.createRing(bagua, this.baguaRing, 90);

        // 十天干
        const tiangan = ['壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛'];
        this.createRing(tiangan, this.tianganRing, 120);

        // 十二地支
        const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        this.createRing(dizhi, this.dizhiRing, 150);

        // 二十四山
        const mountains = [
            '子', '癸', '丑', '艮', '寅', '甲',
            '卯', '乙', '辰', '巽', '巳', '丙',
            '午', '丁', '未', '坤', '申', '庚',
            '酉', '辛', '戌', '乾', '亥', '壬'
        ];
        this.createRing(mountains, this.mountainsRing, 180);
    }

    createRing(items, ring, radius) {
        const angleStep = 360 / items.length;
        items.forEach((item, index) => {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.textContent = item;
            const angle = index * angleStep;
            marker.style.transform = `
                rotate(${angle}deg) 
                translate(0, -${radius}px) 
                rotate(-${angle}deg)
            `;
            ring.appendChild(marker);
        });
    }

    initCompass() {
        if (window.DeviceOrientationEvent) {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+ 需要请求权限
                document.body.addEventListener('click', async () => {
                    try {
                        const permission = await DeviceOrientationEvent.requestPermission();
                        if (permission === 'granted') {
                            this.startCompass();
                        }
                    } catch (error) {
                        console.error('权限请求被拒绝:', error);
                    }
                }, { once: true });
            } else {
                // 其他设备直接开始
                this.startCompass();
            }
        } else {
            alert('您的设备不支持指南针功能');
        }
    }

    startCompass() {
        window.addEventListener('deviceorientationabsolute', (event) => {
            // 获取设备朝向角度 - 针对华为等安卓设备的特殊处理
            let heading;
            if (event.webkitCompassHeading) {
                // iOS 设备
                heading = event.webkitCompassHeading;
            } else {
                // 安卓设备，包括华为
                heading = 360 - event.alpha;
            }
            
            // 旋转指针和所有圆环
            this.arrow.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
            this.baguaRing.style.transform = `rotate(${heading}deg)`;
            this.tianganRing.style.transform = `rotate(${heading}deg)`;
            this.dizhiRing.style.transform = `rotate(${heading}deg)`;
            this.mountainsRing.style.transform = `rotate(${heading}deg)`;
            
            // 更新方向文字
            this.updateDirection(heading);
        });

        // 添加普通的 deviceorientation 事件作为后备方案
        window.addEventListener('deviceorientation', (event) => {
            if (!event.alpha) return; // 如果没有方向数据则返回
            
            const heading = 360 - event.alpha;
            
            this.arrow.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
            this.baguaRing.style.transform = `rotate(${heading}deg)`;
            this.tianganRing.style.transform = `rotate(${heading}deg)`;
            this.dizhiRing.style.transform = `rotate(${heading}deg)`;
            this.mountainsRing.style.transform = `rotate(${heading}deg)`;
            
            this.updateDirection(heading);
        });
    }

    updateDirection(heading) {
        const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
        const index = Math.round(heading / 45) % 8;
        this.directionText.textContent = directions[index];
    }
}

// 初始化罗盘
document.addEventListener('DOMContentLoaded', () => {
    new Compass();
}); 