// 3D Water Particle Effect using Three.js
(function() {
    let scene, camera, renderer, particles, count = 0;
    const amountX = 50, amountY = 50, spacing = 100;

    function init() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '1';
        container.style.pointerEvents = 'none';
        container.style.opacity = '0.6';
        document.querySelector('.hero').appendChild(container);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        camera.position.y = 500;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const numParticles = amountX * amountY;
        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;
        for (let ix = 0; ix < amountX; ix++) {
            for (let iy = 0; iy < amountY; iy++) {
                positions[i] = ix * spacing - ((amountX * spacing) / 2); // x
                positions[i + 1] = 0; // y
                positions[i + 2] = iy * spacing - ((amountY * spacing) / 2); // z
                scales[j] = 1;
                i += 3;
                j++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0x00d2ff) },
            },
            vertexShader: `
                attribute float scale;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_PointSize = scale * ( 300.0 / - mvPosition.z );
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                void main() {
                    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                    gl_FragColor = vec4( color, 1.0 );
                }
            `,
            transparent: true
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize);
        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        for (let ix = 0; ix < amountX; ix++) {
            for (let iy = 0; iy < amountY; iy++) {
                positions[i + 1] = (Math.sin((ix + count) * 0.15) * 50) +
                                   (Math.sin((iy + count) * 0.25) * 50);
                scales[j] = (Math.sin((ix + count) * 0.15) + 1) * 8 +
                            (Math.sin((iy + count) * 0.25) + 1) * 8;
                i += 3;
                j++;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.03;
    }

    // Load Three.js first
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = init;
        document.head.appendChild(script);
    } else {
        init();
    }
})();
