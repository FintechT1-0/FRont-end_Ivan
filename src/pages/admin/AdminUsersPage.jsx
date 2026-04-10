import { useEffect, useMemo, useState } from "react";
import client from "../../api/client";
import { useLang } from "../../context/LanguageContext";

const tableBlock = {
  background:
    "linear-gradient(180deg, rgba(245,247,250,0.96) 0%, rgba(239,243,248,0.96) 100%)",
  border: "1px solid rgba(8,38,72,0.06)",
  boxShadow: "0 14px 28px rgba(0,0,0,0.10)",
};

const summaryCard = {
  background:
    "linear-gradient(180deg, rgba(8,38,72,0.98) 0%, rgba(6,31,59,0.98) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 30px rgba(0,0,0,0.16)",
};

function normalizeUsersResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      users: payload,
      total_pages: 1,
      current_page: 1,
      total_users: payload.length,
    };
  }

  return {
    users: payload?.users || [],
    total_pages: payload?.total_pages || 1,
    current_page: payload?.current_page || 1,
    total_users: payload?.total_users || 0,
  };
}

export default function AdminUsersPage() {
  const { lang } = useLang();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({
    total_pages: 1,
    current_page: 1,
    total_users: 0,
  });

  const text = useMemo(() => {
    return {
      title: lang === "ua" ? "КОРИСТУВАЧІ" : "USERS",
      searchName: lang === "ua" ? "Ім’я" : "Name",
      searchSurname: lang === "ua" ? "Прізвище" : "Surname",
      searchEmail: lang === "ua" ? "Email" : "Email",
      all: lang === "ua" ? "Усі" : "All",
      active: lang === "ua" ? "Активні" : "Active",
      blocked: lang === "ua" ? "Заблоковані" : "Blocked",
      id: "ID",
      fullName: lang === "ua" ? "Користувач" : "User",
      userEmail: "Email",
      status: lang === "ua" ? "Статус" : "Status",
      actions: lang === "ua" ? "Дії" : "Actions",
      noUsers: lang === "ua" ? "Користувачів не знайдено" : "No users found",
      loading: lang === "ua" ? "Завантаження..." : "Loading...",
      totalUsers: lang === "ua" ? "Усього користувачів" : "Total Users",
      page: lang === "ua" ? "Сторінка" : "Page",
      prev: lang === "ua" ? "Назад" : "Prev",
      next: lang === "ua" ? "Далі" : "Next",
      block: lang === "ua" ? "Заблокувати" : "Block",
      unblock: lang === "ua" ? "Розблокувати" : "Unblock",
      suspended: lang === "ua" ? "Заблокований" : "Suspended",
      normal: lang === "ua" ? "Активний" : "Active",
      apply: lang === "ua" ? "Застосувати" : "Apply",
      blockConfirm:
        lang === "ua"
          ? "Точно змінити статус цього користувача?"
          : "Are you sure you want to change this user status?",
      updateFail:
        lang === "ua"
          ? "Не вдалося оновити статус користувача"
          : "Failed to update user status",
    };
  }, [lang]);

  async function loadUsers(nextPage = page) {
    try {
      setLoading(true);

      const params = {
        page: nextPage,
        page_size: 20,
      };

      if (name.trim()) params.name = name.trim();
      if (surname.trim()) params.surname = surname.trim();
      if (email.trim()) params.email = email.trim();
      if (statusFilter === "blocked") params.is_suspended = true;
      if (statusFilter === "active") params.is_suspended = false;

      const { data } = await client.get("/telemetry/users", { params });
      const normalized = normalizeUsersResponse(data);

      setUsers(normalized.users);
      setMeta({
        total_pages: normalized.total_pages,
        current_page: normalized.current_page,
        total_users: normalized.total_users,
      });
      setPage(normalized.current_page);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
      setMeta({
        total_pages: 1,
        current_page: 1,
        total_users: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(1);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    await loadUsers(1);
  }

  async function handleToggleSuspend(user) {
    const ok = window.confirm(text.blockConfirm);
    if (!ok) return;

    try {
      setBusyId(user.id);

      await client.post("/telemetry/suspend", {
        id: user.id,
        status: !user.is_suspended,
      });

      await loadUsers(page);
    } catch (error) {
      console.error("Failed to suspend/unblock user:", error);
      alert(text.updateFail);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "18px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "36px",
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {text.title}
        </h1>
      </div>

      <div
        style={{
          ...summaryCard,
          borderRadius: "10px",
          padding: "12px 14px",
          color: "#FFFFFF",
          marginBottom: "16px",
          maxWidth: "240px",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            opacity: 0.9,
            marginBottom: "10px",
          }}
        >
          {text.totalUsers}
        </div>

        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          {meta.total_users}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.2fr 180px auto",
          gap: "12px",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={text.searchName}
          style={filterInputStyle}
        />

        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder={text.searchSurname}
          style={filterInputStyle}
        />

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={text.searchEmail}
          style={filterInputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterInputStyle}
        >
          <option value="">{text.all}</option>
          <option value="active">{text.active}</option>
          <option value="blocked">{text.blocked}</option>
        </select>

        <button
          type="submit"
          style={{
            minWidth: "110px",
            height: "32px",
            borderRadius: "999px",
            border: "none",
            background: "#B3131A",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 10px 18px rgba(179,19,26,0.24)",
          }}
        >
          {text.apply}
        </button>
      </form>

      <div style={{ ...tableBlock, borderRadius: "12px", overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1.4fr 1.4fr 180px 160px",
            gap: "12px",
            padding: "10px 14px",
            fontSize: "12px",
            color: "#6C7480",
            background: "rgba(255,255,255,0.4)",
            borderBottom: "1px solid rgba(8,38,72,0.08)",
            fontWeight: 600,
          }}
        >
          <div>{text.id}</div>
          <div>{text.fullName}</div>
          <div>{text.userEmail}</div>
          <div>{text.status}</div>
          <div>{text.actions}</div>
        </div>

        {loading ? (
          <div
            style={{
              padding: "20px 14px",
              color: "#20324A",
              fontSize: "13px",
            }}
          >
            {text.loading}
          </div>
        ) : users.length === 0 ? (
          <div
            style={{
              padding: "20px 14px",
              color: "#20324A",
              fontSize: "13px",
            }}
          >
            {text.noUsers}
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1.4fr 1.4fr 180px 160px",
                gap: "12px",
                padding: "12px 14px",
                fontSize: "12px",
                color: "#20324A",
                borderBottom: "1px solid rgba(8,38,72,0.06)",
                alignItems: "center",
                background: "rgba(255,255,255,0.76)",
              }}
            >
              <div>{user.id}</div>

              <div>
                {user.name} {user.surname}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </div>

              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: "24px",
                    padding: "0 10px",
                    borderRadius: "999px",
                    background: user.is_suspended
                      ? "rgba(179,19,26,0.14)"
                      : "rgba(115,193,107,0.16)",
                    color: user.is_suspended ? "#B3131A" : "#317B2F",
                    fontWeight: 600,
                  }}
                >
                  {user.is_suspended ? text.suspended : text.normal}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  disabled={busyId === user.id}
                  onClick={() => handleToggleSuspend(user)}
                  style={{
                    minWidth: "120px",
                    height: "30px",
                    borderRadius: "999px",
                    border: "none",
                    background: user.is_suspended ? "#173B66" : "#B3131A",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: busyId === user.id ? 0.7 : 1,
                  }}
                >
                  {user.is_suspended ? text.unblock : text.block}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
          color: "#FFFFFF",
          fontSize: "12px",
        }}
      >
        <div>
          {text.page} {meta.current_page} / {meta.total_pages}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => loadUsers(page - 1)}
            style={pageButtonStyle(page <= 1)}
          >
            {text.prev}
          </button>

          <button
            type="button"
            disabled={page >= meta.total_pages}
            onClick={() => loadUsers(page + 1)}
            style={pageButtonStyle(page >= meta.total_pages)}
          >
            {text.next}
          </button>
        </div>
      </div>
    </div>
  );
}

const filterInputStyle = {
  height: "32px",
  borderRadius: "999px",
  border: "none",
  outline: "none",
  padding: "0 12px",
  fontSize: "12px",
  background: "#FFFFFF",
  color: "#20324A",
};

function pageButtonStyle(disabled) {
  return {
    minWidth: "76px",
    height: "30px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#FFFFFF",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.45 : 1,
  };
}