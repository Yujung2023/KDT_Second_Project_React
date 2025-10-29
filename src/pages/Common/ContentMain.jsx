import { Routes, Route, useLocation } from "react-router-dom";
import styles from "./ContentMain.module.css";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ContentTap from "./ContentTap";

import Home from "../Home/Home";
import MailRoute from "../Mail/MailRoute";
import BoardRoute from "../Board/BoardRoute";
import ScheduleRoute from "../Schedule/ScheduleRoute";
import ContactsRoute from "../Contacts/ContactsRoute";
import MessengerRoute from "../Messenger/MessengerRoute";
import WorkExpenseRoute from "../WorkExpense/WorkExpenseRoute";
import EapprovalRoute from "../EApproval/EApprovalRoute";
import NoteRoute from "../Note/NoteRoute";
import TaskRoute from "../Task/TaskRoute";
import ManagementRoute from "../Management/ManagementRoute";
import BoardTabs from "../Board/BoardTabs";
import ManagementTabs from "../Management/ManagementTabs";
import ContactsTabs from "../Contacts/ContactsTab";
import MyPage from "./Mypage.jsx";
import LeaveRoute from "../WorkExpense/LeaveRoute";

const ContentMain = () => {

  const location = useLocation();

  // ✅ 현재 경로에 맞는 탭 선택
  const renderTabs = () => {
    if (location.pathname.startsWith("/board")) return <BoardTabs />;
    if (location.pathname.startsWith("/management")) return <ManagementTabs />;
    if (location.pathname.startsWith("/contacts")) return <ContactsTabs />;
    return null;
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <div className={styles.side}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <div className={styles.contentBody}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mail/*" element={<MailRoute />} />
              <Route path="/board/*" element={<BoardRoute />} />
              <Route path="/schedule/*" element={<ScheduleRoute />} />
              <Route path="/contacts/*" element={<ContactsRoute />} />
              <Route path="/messenger/*" element={<MessengerRoute />} />
              <Route path="/workExpense/*" element={<WorkExpenseRoute />} />
              <Route path="/Eapproval/*" element={<EapprovalRoute />} />
              <Route path="/note/*" element={<NoteRoute />} />
              <Route path="/task/*" element={<TaskRoute />} />
              <Route path="/management/*" element={<ManagementRoute />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/leave/*" element={<LeaveRoute />} />
              <Route path="*" element={<h2>404 Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentMain;
