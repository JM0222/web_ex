let imgsource = []
let imgsource_dep = []
function setdepthimg() {
    let imgelem;
    for (i = 0; i < 8; i++) {
        imgelem = new Image();
        imgelem.src = `${i}.jpg`;
        imgsource.push(imgelem);
    }
    let imgelem_dep;
    for (i = 0; i < 8; i++) {
        imgelem_dep = new Image();
        imgelem.src = `${i-1}.png`;
        imgsource_dep.push(imgsource_dep);
    }
}
setdepthimg();
function Make3D(cnt){
    // 원본 이미지 경로와 Depth map 경로.
    let src = `${cnt}.jpg`;
    let srcMap = `${cnt-1}.png`;
    // 출력될 이미지 크기.
    let width = 1920
    let height = 1280
    // HTML 요소.
    const $target = document.querySelector('#depth1');
    $target.style.width = `${width}px`;
    $target.style.height = `${height}px`;

    // 출력될 이미지 크기와 동일하게 PixiJS 앱을 정의.
    let app = new PIXI.Application({
        width,
        height
    });
    $target.appendChild(app.view);

    // 화면에 렌더링 될 원본 이미지(Sprite 객체)를 정의.
    let img = new PIXI.Sprite.from(src);
    img.width = width;
    img.height = height;

    // 화면에 렌더링 될 Depth map(Sprite 객체)을 정의.
    let depthMap = new PIXI.Sprite.from(srcMap);
    depthMap.width = width;
    depthMap.height = height;

    // 지정된 Depth map(깊이 정보)을 사용해, 이미지의 위치 정보를 변화시킬 수 있는 필터를 등록.
    let displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);

    // 앱 스테이지에 각 이미지를 등록.
    app.stage.addChild(img);
    app.stage.addChild(depthMap);
    // 앱 스테이지에 필터 정보를 등록.
    app.stage.filters = [displacementFilter];

    // HTML 요소 내에서 마우스를 움직이면,
    // 그 정보로 필터 정보를 수정해 원하는 효과를 구현합니다.
    $target.onmousemove = function(e) {
        displacementFilter.scale.x = (width / 2 - e.clientX) / 20;
        displacementFilter.scale.y = (height / 2 - e.clientY) / 20;

        };
}
for(i=1; i<9; i++){
    (function(x){
      setTimeout(function(){
        Make3D(x);
      }, 5000*x);
    })(i);
  }




