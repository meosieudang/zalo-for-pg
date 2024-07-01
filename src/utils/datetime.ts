export const renderCurrentMoment = () => {
  const currentTime = new Date().getHours();
  let greetingText = "";

  if (currentTime < 12) {
    greetingText = "Chào buổi sáng,";
  } else if (currentTime < 18) {
    greetingText = "Chào buổi chiều,";
  } else {
    greetingText = "Chào buổi tối,";
  }
  return greetingText;
};
