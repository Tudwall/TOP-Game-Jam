import { makeDraggable, makeDroppable } from "./drag-drop";
import homeImage from "../images/styling/home.png"
import arrow from "../images/styling/arrow-right.png"

const createChapterStructure = (chapterObj, callback) => {
  let dragContainer; 

  const hideStoryContent = () => {
    const story = document.querySelector("p");
    const images = dragContainer.querySelectorAll(".picture")
    const nextButton = document.querySelector(".next");
    const question = document.querySelector(".chapter-question");

    
    story.classList.toggle("hide");
    images.forEach(img => img.classList.toggle("hide"))
    nextButton.classList.toggle("hide");
    question.classList.toggle("hide");
  };

  const createButtons = (hasImages) => {

    const homeButton = document.createElement("img");
    homeButton.classList.add("home");
    homeButton.src = homeImage;
    //homeButton.addEventListener('click', showHomeScreen)

    const nextChapterButton = document.createElement("img");
    nextChapterButton.classList.add("next");
    nextChapterButton.src = arrow;

    if (hasImages) {
      nextChapterButton.addEventListener("click", hideStoryContent);
    } else {
      nextChapterButton.addEventListener("click", () => callback(chapterObj));
    }

    return { homeButton, nextChapterButton };
  };

  const setupImages = () => {
    dragContainer = document.createElement("div");
    const images = chapterObj.getImages();

    for (let image of images) {
      const classArr = image.cssClass.split(" ");

      const picture = document.createElement("img");
      picture.src = image.url;

      const pictureContainer = document.createElement("div");
      pictureContainer.classList.add("picture")
      pictureContainer.classList.add(classArr[0]);
      pictureContainer.classList.add(classArr[1]);
      pictureContainer.append(picture);

      if (picture.className !== "drop-container") {
        makeDraggable(pictureContainer, dragContainer);
      }
      
      dragContainer.append(pictureContainer);
    }

    makeDroppable(
      dragContainer.querySelector(".right"),
      dragContainer.querySelector(".drop-container"),
      () => callback(chapterObj)
    );

    return dragContainer;
  };

  const setupChapterPage = () => {
    const section = document.createElement("section");

    const story = document.createElement("p");
    story.classList.add("chapter-story");
    story.textContent = chapterObj.getStory();
  
    if (chapterObj.getImages() !== null) {
      //chapter has images and question. 

      const { homeButton, nextChapterButton } = createButtons(true);

      const title = document.createElement("H1");
      title.classList.add("chapter-title");
      title.textContent = `Chapter ${chapterObj.getChapterNumber()}`;

      const question = document.createElement("p");
      question.classList.add("chapter-question");
      question.classList.add("hide");
      question.textContent = chapterObj.getQuestion();
      
      const dragContainer = setupImages();
      dragContainer.id = "drag-container";
      dragContainer.append(homeButton, nextChapterButton, title, story, question);

      const images = dragContainer.querySelectorAll(".picture")
      images.forEach(img => img.classList.add("hide"))

      section.append(dragContainer);
    } else {
      //chapter is text only.
      
      const { homeButton, nextChapterButton } = createButtons(false);
      section.append(homeButton, nextChapterButton, story);
    }

    return section;
  };

  return setupChapterPage();
};

export { createChapterStructure };

/********************* HOW TO USE ******************
Create new chapter using Chapter factory which takes following parameters:
1. Story - string with story for the chapter.
2. Images - array of objects. Every object should have two keys:
    a. cssClass - name of the class for img node,
    b. url - image url.
3. Question - string with question.
4. ChapterNumber - number for chapter.

After crating new chapter it should be passed as argument to createChapterStructure
that will create DOM structure for the chapter.

*/
