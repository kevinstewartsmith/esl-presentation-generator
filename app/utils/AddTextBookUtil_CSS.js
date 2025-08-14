//Styles
export const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#f5f5f5",
  color: "#bdbdbd",
  //color: "green",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: "10vh",
};

export const focusedStyle = {
  borderColor: "#2196f3",
};

export const acceptStyle = {
  borderColor: "#00e676",
};

export const rejectStyle = {
  borderColor: "#ff1744",
};

export const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  backgroundColor: "white",
};

export const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

export const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

export const img = {
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain", // Ensures that the image fits within its container while maintaining its aspect ratio
};
