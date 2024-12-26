import React, { useState } from "react";
import { Input, Button, message, Row, Col } from "antd";
import { ipcRenderer } from "electron"; // 引入 ipcRenderer 用于与主进程通信

const Home: React.FC = () => {
  const [fileId, setFileId] = useState<string>("1"); // 设置默认的文件 ID 为 '1'
  const [loading, setLoading] = useState<boolean>(false); // 加载状态

  // 触发合并操作
  const handleMerge = async () => {
    if (!fileId) {
      message.error("请提供文件 ID！");
      return;
    }

    setLoading(true);
    try {
      // 向主进程发送合并请求，传入 fileId
      const result = await window.electronAPI.mergeAudio(fileId);
      
      if (result.error) {
        message.error(`合并失败: ${result.details}`);
      } else {
        message.success('合并成功！');
      }
    } catch (error) {
      message.error('合并过程中出现错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>欢迎来到主页！</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="请输入文件 ID"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
        </Col>
      </Row>

      <Button 
        type="primary" 
        loading={loading} 
        onClick={handleMerge}
        disabled={loading}
      >
        合并视频和音频
      </Button>
    </div>
  );
};

export default Home;
