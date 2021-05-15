// const body = document.querySelector('body');
//         document.querySelector('.toggle').onclick =function(){
    //             body.classList.toggle('light')
    //         }
    // 익명함수
(()=>{


    let yOffset = 0;
    let preScrollHeight = 0; // 현재 이전의 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된 scroll-section(int)
    let enterNewScene = false; // 새로운 scene 이 시작된순간  true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // device 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                // text animation 가져오기
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                // canvas 가져오기
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 143,
                imageSequence: [0, 142],
                canvas_opacity: [1, 0, {start: 0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]

            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        }
    ];
    // canvas에 들어갈 이미지 배열 미리 넣기
    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++){
            imgElem = new Image();
            imgElem.src = `./images2/Seoul - 21985.mp4_${0 + i}.png`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        console.log(sceneInfo[0].objs.videoImages)
    }
    setCanvasImages();

    function setLayout(){
        // type 에따라 scrollHeight 조절
        for (let i =0; i < sceneInfo.length; i++){
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = 
                    sceneInfo[i].heightNum * window.innerHeight;
            }else {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = 
                    `${sceneInfo[i].scrollHeight}px`;
        }
        // 새로고침시 currentScene 세팅
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        // canvas 크기 device 별 조정하기
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function scrollLoop(){
        enterNewScene = false;
        preScrollHeight = 0;
        for (let i = 0; i < currentScene; i++){
            preScrollHeight = preScrollHeight + sceneInfo[i].scrollHeight;
        }
        if (yOffset > preScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);

        }
        if (yOffset < preScrollHeight){
            enterNewScene = true;
            if (currentScene === 0) return; // 바운스효과 막아두기
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if (enterNewScene) return;
        playAnimation();
    }

    // values 값 계산함수 , currentYOffset 현재scene에서의 yoffset
    function calcValues(values, currentYOffset){
        let rv;
        //  현재 scene에서 절반스크롤시 0.5 비율
        //  현재 씬에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight
        const scrollRatio = currentYOffset / scrollHeight;
        if (values.length === 3){
            // start ~ end 애니메이션 실행시켜주기
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            // 범위안에 들어왔을경우
            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1]-values[0]) + values[0];
            }else if (currentYOffset < partScrollStart) {
                rv = values[0]; // 범위보다 적을경우
            }else if (currentYOffset > partScrollEnd) {
                rv = values[1]; // 범위 초과
            }
        } else{
            rv =  scrollRatio * (values[1]-values[0]) + values[0];
        }
        return rv;
    }

    // 애니메이션 함수
    function playAnimation(){
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - preScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; // scroll 비율
        switch (currentScene) {
            case 0:
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
    
                break;
            case 1:
                break;
        }
    }
 


    // window 창 크기 바뀔때마다 resize
    window.addEventListener('resize',setLayout);
    window.addEventListener('scroll', ()=>{
        yOffset = window.pageYOffset;
        scrollLoop(); // 스크롤시 동작하는 함수
    })

    window.addEventListener('load',() => {
        setLayout();
        // 첫로딩때도 그림그려주기 canvasimage
        sceneInfo[0].objs.context.drawImage(objs.videoImages[0], 0, 0);

    });
    window.addEventListener('resize',setLayout);
})();