<template>
    <div ref="container" class="particle-container">
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
// import { init } from 'echarts';

const container = ref(null);

// 配置参数
const config = {
    particleCount: 4000,    //粒子数量，越多越细腻但越卡
    particleSize: 3.5,     //粒子大小
    color: '#00ffff',       //粒子颜色(Element Plus 蓝)
    waveSpeed: 0.005,       //波浪流动速度
};

let scene, camera, renderer, particles, count = 0;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

onMounted(()=> {
    init();
    animate();
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);
});

onUnmounted(()=> {
    window.removeEventListener('resize', onWindowResize);
    document.removeEventListener('mousemove', onDocumentMouseMove);

    if(renderer) renderer.dispose();
    console.log('移除监听')
});

function init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 初始化场景
    scene = new THREE.Scene();
    // 设置一点雾化，让远处的粒子淡出，增加深邃感
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // 初始化相机
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.z = 1000;

    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });   // alpha: true 允许背景透明
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.value.appendChild(renderer.domElement);

    // 创建粒子几何体
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const colorObj = new THREE.Color(config.color);

    for(let i = 0; i < config.particleCount; i++) {
        // 随机分布再x，y平面
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        positions.push(x, y, z);

        // 增加简单的颜色变化，增加层次感
        colors.push(colorObj.r, colorObj.g, colorObj.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // 创建材质
    const material = new THREE.PointsMaterial({
        size: config.particleSize,
        // vertexColors: true,     // 启用顶点颜色
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,    // 叠加混合模式，让重叠的粒子更亮
        depthWrite: false,      // 【新增】防止粒子相互遮挡产生难看的黑边
        sizeAttenuation: true,   // 【新增】开启近大远小效果，增加空间感
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function onDocumentMouseMove(event) {
    // 记录鼠标位置，归一化到-1到1之间
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;

    // console.log('鼠标位置：', mouseX, mouseY);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // 缓动效果：让相机平滑地跟随鼠标，而不是生硬跳转
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    // 简单的波浪算法：修改粒子的Y轴位置
    // 注意：这里为了性能，没有每帧遍历所有粒子，而是旋转整个粒子系统
    // 如果需要复杂的波浪起伏，需要遍历 position attribute， 性能消耗较大
    const time = Date.now() * config.waveSpeed;

    // 让整个粒子群缓慢旋转
    particles.rotation.x = time * 0.1;
    particles.rotation.y = time * 0.15;

    // 根据鼠标位置微调相机的视角，制造视差效果
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
</script>

<style scoped>
.particle-container {
    position: fixed;    /**固定在屏幕最底层 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;    /**确保在内容下方 */
    pointer-events: none;   /**关键：让鼠标事件穿透，不影响点击下面的按钮 */
    background: #0f172a;;   /**深色背景，衬托粒子 */
}
</style>