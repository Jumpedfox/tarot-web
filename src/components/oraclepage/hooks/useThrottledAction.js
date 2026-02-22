import { useMemo, useEffect } from "react";
import { throttle } from "lodash";

export const useThrottledAction = (delay = 1000) => {
  const throttledAction = useMemo(
    () =>
      throttle(
        (fn) => {
          fn();
        },
        delay,
        { leading: true, trailing: false },
      ),
    [delay],
  );

  useEffect(() => {
    return () => throttledAction.cancel();
  }, [throttledAction]);

  return throttledAction;
};
