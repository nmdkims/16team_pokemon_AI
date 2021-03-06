// 화면전환 효과: 새로고침하면 페이드 인
function isSameAsLocation(uriString) {
    const uri = new URL(uriString);
    return (
        uri.origin === window.location.origin &&
        uri.pathname === window.location.pathname
    );
}
function pageTransition(nodeList) {
    nodeList.forEach((node) => {
        if (!(node instanceof HTMLAnchorElement)) return;
        const {href} = node;
        if (!href || node.target === "_blank" || isSameAsLocation(href)) return;
        node.addEventListener("click", (event) => {
            event.preventDefault();
            document.body.addEventListener(
                "transitionend",
                () => {
                    window.location.href = href;
                },
                {passive: true, once: true});
            document.body.classList.add("hidden");
        });
    });
}
// pageTransition(document.querySelectorAll("a"))



// 업로드 된 이미지 미리보기
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // $('.image-upload-wrap').hide();
            $('.file-upload-input').hide();
            $('.drag-text').hide();
            $('#loading').show();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-image').show();
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
        init().then(function () {
            console.log("hello");
            predict();
            $('#loading').hide();
        });
    } else {
        removeUpload();
    }
}
function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});



// 머신러닝
let URL;
let pokemonModel = "https://teachablemachine.withgoogle.com/models/pfy8RXEpy/";
let model, webcam, labelContainer, maxPredictions;
async function init() {

    URL = pokemonModel;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        var element = document.createElement("div")
        element.classList.add("d-flex");
        labelContainer.appendChild(element);
    }
}
async function predict() {
    var image = document.getElementById("face-image")
    const prediction = await model.predict(image, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    console.log(prediction[0].className);
    var resultTitle, resultExplain, resultCeleb;

    switch (prediction[0].className) {
        case "pikachu":
            resultTitle = "피카츄"
            resultExplain = "다정다감하고 귀여운 당신은 모든 사람들에게 즐거움을 주는 호감형이다! 친절하고 활발한 성격으로 어디에서도 인기폭발이며 애교와 웃음이 많아 연인에게 특히나 사랑스럽다. 당신은 애인바라기로 애인의 관심이 부족하면 시무룩해지고 외로움을 타는 모습이 마치 강아지와 똑 닮았다!"
            resultCeleb = "피카츄상 연예인: 강다니엘, 백현(엑소), 솔지(EXID)"
            break;
        case "charmander":
            resultTitle = "파이리"
            resultExplain = "천진난만하고 귀여운 당신은 주변 사람들에게 기쁨을 주는 행복바이러스다! 호기심이 많아 활발하며 귀엽고 순수한 외모로 연인의 보호본능을 자극한다. 존재 자체가 상큼한 당신은 특별한 애교 없이도 연인에게 너무나도 사랑스럽다!"
            resultCeleb = "파이리상 연예인: 다현(트와이스), 동해(슈퍼주니어), 엠버(f(x)), 김영철(배우/feat.김두한)"
            break;
        case "squirtle":
            resultTitle = "꼬부기"
            resultExplain = "무뚝뚝한 당신의 첫인상은 차가워 보이지만 묘한 매력을 풍겨 언제나 인기가 넘친다. 자존심이 세계 1등과 맞먹지만 관심 받는 것을 좋아하고 연인에게는 은근히 애교쟁이다. 시크한 츤데레로 연인에게 끊임없이 설렘을 안겨주는 당신은 고양이와 닮았다!"
            resultCeleb = "꼬부기상 연예인: 하연수, 유정(브레이브걸스), 솔라(마마무), 나연(트와이스)"
            break;
        case "diglett":
            resultTitle = "디그다"
            resultExplain = "첫 인상은 무서워 보이지만 알고 보면 귀여운 매력의 당신! 애교만점 깜찍 덩어리! 매끈한 당신의 섹시함에 빠지면 헤어나올 수가 없겠군요!!"
            resultCeleb = "디그다 상 연예인: 밥샵(격투기선수), 제이슨 스타뎀, 존 맥클레인(다이하드)"
            break;
        case "snorlax":
            resultTitle = "잠만보"
            resultExplain = "묵직해보이지만 볼수록 매력덩어리! 안정감있는 당신은 연인에게 듬직한 존재! 포근한 매력에 듬직함까지 갖춘 최고의 남자다!"
            resultCeleb = "잠만보상 연예인: 유민상(개그맨), 마동석, 조세호"
            break;
        case "growlithe":
            resultTitle = "가디"
            resultExplain = "무심한 성격에 첫인상은 나쁜 남자 같지만, 알고 보면 따뜻함이 묻어나는 당신! 시크한 매력에 선뜻 다가가지 못하지만 한번 다가가면 헤어나올 수 없는 터프한 매력을 가진 카리스마 있는 남자다."
            resultCeleb = "가디상 연예인: 고경표, 윤두준(하이라이트), 이동욱, 공유"
            break;
        case "jigglypuff":
            resultTitle = "푸린"
            resultExplain = "당신은 태생부터 연예인! 많은 사람들의 관심과 사랑을 받으며, 사람들에게 그 사랑을 되돌려주는 전형적인 초특급 슈퍼스타 연예인"
            resultCeleb = "푸린상 연예인: 김호성(내배캠 NAMED USER), 이혜정(요리연구가), 초아(AOA)"
            break;
        case "mew":
            resultTitle = "뮤"
            resultExplain = "옆에 있으면 눈이 가는 귀염뽀짝! 매력충만! 당신은 뭘해도 사랑스러운 귀염형 스타일"
            resultCeleb = "뮤상 연예인: 손연재, 이솜, 한예리, 한지민"
            break;
        case "grimer":
            resultTitle = "질퍽이"
            resultExplain = "첫인상은 피하고 싶지만 알고보면 사귀고 싶은 능력자 친구! 자신의 능력을 십분 활용할 줄 아는 재능형 인재"
            resultCeleb = "질퍽이상 연예인: 방시혁, 갱제(스트리머), 김태호(PD), ,최홍만(격투기선수), 고창석"
            break;
        case "ditto":
            resultTitle = "메타몽"
            resultExplain = "특징이 없어보이지만 알고보면 팔방미인! 당신은 팔색조! 사교성이 좋으며 두루두루 잘 어울리는 호감형 스타일!"
            resultCeleb = "메타몽상 연예인: 안재홍, 김종국, 조우진, 비, 이종석"
            break;
        default:
            resultTitle = "알수없음"
            resultExplain = ""
            resultCeleb = ""
    }

    var title = "<div class='" + prediction[0].className + "-poketmon-title'>" + resultTitle + "</div>"
    var explain = "<div class='poketmon-explain pt-2'>" + resultExplain + "</div>"
    var celeb = "<div class='" + prediction[0].className + "-poketmon-celeb pt-2 pb-2'>" + resultCeleb + "</div>"
    $('.result-message').html(title + explain + celeb);
    var barWidth;
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability.toFixed(2) > 0.1) {
            barWidth = Math.round(prediction[i].probability.toFixed(2) * 100) + "%";
        } else if (prediction[i].probability.toFixed(2) >= 0.01) {
            barWidth = "4%"
        } else {
            barWidth = "2%"
        }
        var labelTitle;
        switch (prediction[i].className) {
            case "pikachu":
                labelTitle = "피카츄"
                break;
            case "charmander":
                labelTitle = "파이리"
                break;
            case "squirtle":
                labelTitle = "꼬부기"
                break;
            case "diglett":
                labelTitle = "디그다"
                break;
            case "snorlax":
                labelTitle = "잠만보"
                break;
            case "growlithe":
                labelTitle = "가디"
                break;
            case "jigglypuff":
                labelTitle = "푸린"
                break;
            case "mew":
                labelTitle = "뮤"
                break;
            case "grimer":
                labelTitle = "질퍽이"
                break;
            case "ditto":
                labelTitle = "메타몽"
                break;
            default:
                labelTitle = "알수없음"
        }
        var label = "<div class='poketmon-label d-flex align-items-center'>" + labelTitle + "</div>"
        var bar = "<div class='bar-container position-relative container'><div class='" + prediction[i].className + "-box'></div><div class='d-flex justify-content-center align-items-center " + prediction[i].className + "-bar' style='width: " + barWidth + "'><span class='d-block percent-text'>" + Math.round(prediction[i].probability.toFixed(2) * 100) + "%</span></div></div>"
        labelContainer.childNodes[i].innerHTML = label + bar;
    }
}