"use strict";
class JigsawImage {
    constructor(id, src) {
        this.id = id;
        this.src = src;
    }
}
class ImageStore {
    constructor() {
        this.images = [];
        this.listeners = [];
        this.shuffleImagesArray = () => {
            this.images = this.randomArrayShuffle(this.images);
        };
        this.addJigsawImages();
    }
    addListner(listenerFn) {
        this.listeners.push(listenerFn);
        this.updateListeners();
    }
    updateListeners() {
        for (const listener of this.listeners) {
            listener([...this.images]);
        }
    }
    addJigsawImages() {
        const imagesPaths = [
            "./src/img/image_part_001.jpg",
            "./src/img/image_part_002.jpg",
            "./src/img/image_part_003.jpg",
            "./src/img/image_part_004.jpg",
            "./src/img/image_part_005.jpg",
            "./src/img/image_part_006.jpg",
            "./src/img/image_part_007.jpg",
            "./src/img/image_part_008.jpg",
            "./src/img/image_part_009.jpg",
            "./src/img/image_part_010.jpg",
            "./src/img/image_part_011.jpg",
            "./src/img/image_part_012.jpg",
            "./src/img/image_part_013.jpg",
            "./src/img/image_part_014.jpg",
            "./src/img/image_part_015.jpg",
            "./src/img/image_part_016.jpg",
        ];
        let count = 1;
        imagesPaths.forEach((path) => {
            this.images.push(new JigsawImage(count, path));
            count++;
        });
        this.shuffleImagesArray();
    }
    randomArrayShuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ImageStore();
            return this.instance;
        }
    }
    switchImage(pos1, pos2) {
        const pos1Cls = this.images.filter((el) => el.id === Number(pos1));
        const pos2Cls = this.images.filter((el) => el.id === Number(pos2));
        const pos1Ind = this.images.findIndex((el) => el.id === Number(pos1));
        const pos2Ind = this.images.findIndex((el) => el.id === Number(pos2));
        this.images[pos2Ind] = pos1Cls[0];
        this.images[pos1Ind] = pos2Cls[0];
        this.updateListeners();
        if (this.puzzleIsCorrect()) {
            this.declareWinner();
        }
        else {
            return;
        }
    }
    puzzleIsCorrect() {
        const arr = this.images.map((el) => el.id);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i + 1] && arr[i + 1] > arr[i]) {
                continue;
            }
            else if (arr[i + 1] && arr[i + 1] < arr[i]) {
                return false;
            }
        }
        return true;
    }
    declareWinner() {
        document.querySelector("body").style.backgroundColor =
            "#4d7c0f";
        document.querySelector(".heading").textContent =
            "Congratulations 🎉";
    }
}
const state = ImageStore.getInstance();
class ImageItem {
    //   El: HTMLLIElement;
    constructor(hostId, imgCls) {
        this.El = document.querySelector(".jigsaw__image");
        this.dragStartHandler = (e) => {
            // console.log(e);
            e.dataTransfer.setData("text/plain", this.imgCls.id.toString());
        };
        this.dragEndHandler = (e) => {
            // console.log("End");
        };
        this.dragOverHandler = (e) => {
            if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
                e.preventDefault();
            }
        };
        this.dropHandler = (e) => {
            const imgId = e.dataTransfer.getData("text/plain");
            if (imgId === this.imgCls.id.toString())
                return;
            state.switchImage(imgId, this.imgCls.id.toString());
        };
        this.hostElement = document.getElementById(hostId);
        const liEl = this.generateHTMLElement(`${imgCls.id}`, imgCls.src);
        this.element = liEl;
        this.imgCls = imgCls;
        this.attach();
        this.configure();
    }
    generateHTMLElement(id, src) {
        const liEl = document.createElement("li");
        liEl.className = "jigsaw__image";
        liEl.id = id;
        liEl.draggable = true;
        const img = document.createElement("img");
        img.src = src;
        img.className = "img";
        liEl.insertAdjacentElement("afterbegin", img);
        return liEl;
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
    }
}
// const imgItem = new ImageItem();
class ImagesList {
    constructor() {
        this.images = [];
        this.configure();
    }
    configure() {
        state.addListner((images) => {
            this.images = images;
            this.renderImage();
        });
    }
    renderImage() {
        const jigsaw__container = document.getElementById("jigsaw__images");
        jigsaw__container.innerHTML = "";
        for (const img of this.images) {
            new ImageItem("jigsaw__images", img);
        }
    }
}
class Overlay {
    constructor() {
        this.element = document.querySelector(".overlay");
        this.finalImageButton = document.querySelector(".finalImage");
        this.resetButton = document.querySelector(".reset");
        this.config();
    }
    config() {
        this.element.addEventListener("click", (e) => {
            const target = e.target;
            if (target != target.closest(".overlay")) {
                return;
            }
            this.clickHandle();
        });
        this.finalImageButton.addEventListener("click", () => {
            document.querySelector(".overlay").classList.add("showOverlay");
        });
        this.resetButton.addEventListener("click", () => {
            location.reload();
        });
    }
    clickHandle() {
        document.querySelector(".overlay").classList.remove("showOverlay");
    }
}
const overlay = new Overlay();
const imgList = new ImagesList();
