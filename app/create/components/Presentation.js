
import pptxgen from "pptxgenjs";

const Presentation = () => {
  const topic = "Eating pizza every day";
  // 1. Create a Presentation
let pres = new pptxgen();

// 2. Add a Slide to the presentation
let slide = pres.addSlide();

const bulletListItems = [
  { text: "Close your books", options: { bullet: true } },
  { text: "Open your notebooks", options: { bullet: true } },
  { text: "20 seconds", options: { bullet: true, italic: true } }
];

slide.addText(bulletListItems, {
  x: 1.5, // Center horizontally
  y: 2.5, 
  fontSize: 48,
  bullet: true,
  color: "FFFFFF",
  //align: "center" // Center text within the slide
});


let slide2 = pres.addSlide();
// 3. Add 1+ objects (Tables, Shapes, etc.) to the Slide
slide2.addText(`Advantages/Disadvantages: ${topic}`, {
    x: 1.5,
    y: 1.5,
    color: "red",
    fill: { color: "FF8A47" },
    align: pres.AlignH.center,
    fontSize: 34
});

// slide background color is blue
slide.background = { color:  "FF8A47"}; // Set background color to red


// 4. Save the Presentation
pres.writeFile({ fileName: "Sample Presentation.pptx" });

  return (
    <h1>pres</h1>
    // <div>
    //   <h2>Preview</h2>
    //   <iframe src={presentationUrl} width="100%" height="500px" title="Preview"></iframe>
    //   <a href={presentationUrl} download="myPresentation.pptx">Download PowerPoint</a>
    // </div>
  );
};

export default Presentation;
