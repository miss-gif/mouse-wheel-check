import { useState, useEffect } from "react";
import "./ScrollComponent.css";

const ScrollComponent = () => {
  const [scrollingUp, setScrollingUp] = useState(false); // 위쪽 스크롤 여부 상태
  const [scrollingDown, setScrollingDown] = useState(false); // 아래쪽 스크롤 여부 상태
  const [eventLog, setEventLog] = useState([]); // 이벤트 로그 상태 배열
  const [upScrollCount, setUpScrollCount] = useState(0); // 위쪽 스크롤 횟수 상태
  const [downScrollCount, setDownScrollCount] = useState(0); // 아래쪽 스크롤 횟수 상태

  // 컴포넌트 렌더링 이후 스크롤 이벤트 처리
  useEffect(() => {
    // 스크롤 이벤트 핸들러 함수 정의
    const handleWheel = (event) => {
      // 이벤트 로그에 새 항목 추가
      const currentTime = new Date();
      const currentTimeString = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${(
        performance.now() % 1000
      ).toFixed(2)}`; // 현재 시간과 초 이하 2자리의 밀리초를 결합하여 타임스탬프 생성
      const newEventLog = [
        ...eventLog,
        {
          timestamp: currentTimeString,
          type: event.deltaY > 0 ? "Down Scroll" : "Up Scroll", // 스크롤 방향 타입
        },
      ];
      setEventLog(newEventLog); // 이벤트 로그 업데이트

      // 스크롤 방향에 따라 스크롤 여부 상태 업데이트
      if (event.deltaY > 0) {
        setScrollingDown(true);
        setScrollingUp(false);
        setDownScrollCount(downScrollCount + 1); // 아래쪽 스크롤 횟수 증가
      } else if (event.deltaY < 0) {
        setScrollingUp(true);
        setScrollingDown(false);
        setUpScrollCount(upScrollCount + 1); // 위쪽 스크롤 횟수 증가
      }

      // 1초 후에 스크롤 여부 상태 초기화
      setTimeout(() => {
        setScrollingUp(false);
        setScrollingDown(false);
      }, 1000);
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("wheel", handleWheel);

    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 해제
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [eventLog, downScrollCount, upScrollCount]);

  return (
    <>
      <div className="wrapper">
        <div className="eventView">
          <h2>작동 영역</h2>
          <div className="item">
            <div
              className={scrollingUp ? "scroll-button active" : "scroll-button"}
            >
              {scrollingUp ? "Up Scroll" : "Up Scroll"}
            </div>
            <div
              className={
                scrollingDown ? "scroll-button active" : "scroll-button"
              }
            >
              {scrollingDown ? "Down Scroll" : "Down Scroll"}
            </div>
          </div>
        </div>

        <div className="eventLog">
          <div className="scroll-container">
            <h2>이벤트 기록</h2>
            <button
              onClick={() => {
                setEventLog([]);
                setUpScrollCount(0);
                setDownScrollCount(0);
              }}
            >
              리셋
            </button>
            <div className="event-log-container">
              <ul className="event-log">
                {/* 이벤트 로그 항목 매핑 */}
                {eventLog.map((log, index) => (
                  <li key={index} className="event-log-item ">
                    {/* 시간 타임스탬프 */}
                    <span className="log-timestamp">{log.timestamp}</span>
                    {/* 스크롤 방향 타입 */}
                    <span className="log-type">{log.type}</span>
                  </li>
                ))}
              </ul>
              {/* 위쪽 스크롤 횟수 */}
            </div>
          </div>
          <div>
            <p>Up Scroll 횟수: {upScrollCount}</p>
            {/* 아래쪽 스크롤 횟수 */}
            <p>Down Scroll 횟수: {downScrollCount}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollComponent;
