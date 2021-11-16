const handleError = async (
  mutateFunc: () => Promise<unknown>
): Promise<void> => {
  try {
    await mutateFunc();
  } catch (e) {
    console.log(e); // NOTE: 콘솔창에 error 안뜨게 그냥 console.log로 처리했습니다.
  }
};

// NOTE: mutate 함수의 반복적인 try, catch를 막는 함수

export default handleError;
