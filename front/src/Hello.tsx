import React from "react";

const Hello = () => {
  const buildGreetingText: (date: Date) => string = (date) => {
    // 0 ~ 23 の範囲なので+1
    const hours = date.getHours() + 1;
    if (5 < hours && hours < 11) {
      return "おはようございます！";
    } else if (11 < hours && hours < 16) {
      return "こんにちは！";
    } else {
      return "こんばんは！";
    }
  };

  return <div>{buildGreetingText(new Date())}</div>;
};

export default Hello;
