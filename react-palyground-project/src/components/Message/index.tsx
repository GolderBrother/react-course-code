import classnames from "classnames";
import React, { useEffect, useState } from "react";

import styles from "./index.module.scss";

export interface MessageProps {
  type: "error" | "warn";
  content: string;
  theme: 'light' | 'dark';
}

export const Message: React.FC<MessageProps> = (props) => {
  const { type, content, theme } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return visible ? (
    <div className={classnames(styles.msg, styles[type], theme === 'dark' ? styles['dark'] : styles['light'])}>
      <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
      <button className={styles.dismiss} onClick={() => setVisible(false)}>
        ✕
      </button>
    </div>
  ) : null;
};
