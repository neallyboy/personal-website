"use client";

import { useState } from "react";
import { Column, Heading, Row, Tag, Text } from "@once-ui-system/core";
import styles from "./audit.module.scss";
import {
  STATUS_ORDER,
  auditData,
  type AuditCriterion,
  type Category,
  type PassState,
  type Status,
} from "./data";

const CATEGORIES: Category[] = ["SEO", "OG", "GEO", "AEO"];

const CATEGORY_LABELS: Record<Category, string> = {
  SEO: "Search Engine Optimization",
  OG: "Open Graph / Social Sharing",
  GEO: "Generative Engine Optimization",
  AEO: "Answer Engine Optimization",
};

const STATUS_TAG_VARIANT: Record<Status, "danger" | "warning" | "info" | "success"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "success",
};

const PASS_STATE_COLOR: Record<PassState, string> = {
  pass: "var(--success-background-strong)",
  fail: "var(--danger-background-strong)",
  partial: "var(--warning-background-strong)",
  unknown: "var(--neutral-on-background-weak)",
};

const PASS_STATE_LABEL: Record<PassState, string> = {
  pass: "Pass",
  fail: "Fail",
  partial: "Partial",
  unknown: "Unknown",
};

const PASS_STATE_TEXT_COLOR: Record<PassState, string> = {
  pass: "var(--success-on-background-strong)",
  fail: "var(--danger-on-background-strong)",
  partial: "var(--warning-on-background-strong)",
  unknown: "var(--neutral-on-background-medium)",
};

const STAT_DOT_COLOR: Record<Status, string> = {
  critical: "var(--danger-background-strong)",
  high: "var(--warning-background-strong)",
  medium: "var(--info-background-strong)",
  low: "var(--success-background-strong)",
};

function StatusTag({ status }: { status: Status }) {
  return (
    <Tag
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      variant={STATUS_TAG_VARIANT[status]}
      size="s"
    />
  );
}

function AuditRow({ item }: { item: AuditCriterion }) {
  return (
    <div className={styles.row}>
      {/* Criteria */}
      <div className={styles.criteriaCell}>
        <span className={styles.criteriaName}>{item.criteria}</span>
        <span className={styles.criteriaDesc}>{item.testingFor}</span>
      </div>

      {/* Current Value */}
      <div className={styles.currentCell}>
        <div
          className={styles.passIndicator}
          style={{ backgroundColor: PASS_STATE_COLOR[item.passState] }}
          title={item.passState}
        />
        <span className={styles.currentValue}>{item.currentValue}</span>
      </div>

      {/* Should Have */}
      <div className={styles.shouldCell}>
        <span className={styles.mobileLabel}>Should Have</span>
        {item.shouldHave}
      </div>

      {/* How to Fix */}
      <div className={styles.fixCell}>
        <span className={styles.mobileLabel}>How to Fix</span>
        <span className={styles.fixText}>{item.howToFix}</span>
        <code className={styles.example}>{item.example}</code>
      </div>

      {/* Status */}
      <div className={styles.statusCell}>
        <span className={styles.mobileLabel}>Status</span>
        <div className={styles.statusStack}>
          <StatusTag status={item.status} />
          <span
            className={styles.passStateBadge}
            style={{
              backgroundColor: PASS_STATE_COLOR[item.passState],
              color: PASS_STATE_TEXT_COLOR[item.passState],
            }}
          >
            {PASS_STATE_LABEL[item.passState]}
          </span>
        </div>
      </div>
    </div>
  );
}

function AuditSection({ category, items }: { category: Category; items: AuditCriterion[] }) {
  const sorted = [...items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const passCount = items.filter((i) => i.passState === "pass").length;
  const total = items.length;
  const scoreColor =
    passCount === total
      ? "var(--success-on-background-strong)"
      : passCount === 0
        ? "var(--danger-on-background-strong)"
        : "var(--warning-on-background-strong)";
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>{category}</span>
        <span className={styles.sectionSubtitle}>{CATEGORY_LABELS[category]}</span>
        <div className={styles.sectionScore} style={{ marginLeft: "auto" }}>
          <span className={styles.sectionScoreFraction} style={{ color: scoreColor }}>
            {passCount}/{total}
          </span>
          <span className={styles.sectionScoreLabel}>passing</span>
        </div>
      </div>

      <div className={styles.tableHead}>
        <span className={styles.tableHeadCell}>Criteria</span>
        <span className={styles.tableHeadCell}>Current Value</span>
        <span className={styles.tableHeadCell}>Should Have</span>
        <span className={styles.tableHeadCell}>How to Fix</span>
        <span className={styles.tableHeadCell} style={{ textAlign: "right" }}>
          Status
        </span>
      </div>

      {sorted.map((item) => (
        <AuditRow key={item.id} item={item} />
      ))}
    </div>
  );
}

export function AuditClient() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const visibleCategories =
    activeCategory === "all" ? CATEGORIES : ([activeCategory] as Category[]);

  const totalsByStatus = {
    critical: auditData.filter((c) => c.status === "critical").length,
    high: auditData.filter((c) => c.status === "high").length,
    medium: auditData.filter((c) => c.status === "medium").length,
    low: auditData.filter((c) => c.status === "low").length,
  };

  const passCounts = {
    pass: auditData.filter((c) => c.passState === "pass").length,
    fail: auditData.filter((c) => c.passState === "fail").length,
    partial: auditData.filter((c) => c.passState === "partial").length,
    unknown: auditData.filter((c) => c.passState === "unknown").length,
  };

  return (
    <Column fillWidth gap="32" paddingX="l" paddingBottom="40">
      {/* Page header */}
      <Column gap="4">
        <Heading variant="heading-strong-xl">Site Audit</Heading>
        <Text onBackground="neutral-weak" variant="body-default-m">
          SEO · Open Graph · Generative Engine Optimization · Answer Engine Optimization
        </Text>
      </Column>

      {/* Summary stats */}
      <div className={styles.statsRow}>
        {(["critical", "high", "medium", "low"] as Status[]).map((s) => (
          <div key={s} className={styles.statBadge}>
            <div
              className={styles.statDot}
              style={{ backgroundColor: STAT_DOT_COLOR[s] }}
            />
            <span className={styles.statCount}>{totalsByStatus[s]}</span>
            <span className={styles.statLabel}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </div>
        ))}
        <div className={styles.statBadge}>
          <div
            className={styles.statDot}
            style={{ backgroundColor: PASS_STATE_COLOR.pass }}
          />
          <span className={styles.statCount}>{passCounts.pass}</span>
          <span className={styles.statLabel}>Passing</span>
        </div>
        <div className={styles.statBadge}>
          <div
            className={styles.statDot}
            style={{ backgroundColor: PASS_STATE_COLOR.fail }}
          />
          <span className={styles.statCount}>{passCounts.fail + passCounts.partial}</span>
          <span className={styles.statLabel}>Needs Work</span>
        </div>
      </div>

      {/* Category filter */}
      <div className={styles.filterBar}>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeCategory === "all" ? styles.active : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All
          <span className={styles.filterCount}>{auditData.length}</span>
        </button>
        {CATEGORIES.map((cat) => {
          const count = auditData.filter((c) => c.category === cat).length;
          return (
            <button
              type="button"
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Audit sections */}
      {visibleCategories.map((cat) => {
        const items = auditData.filter((c) => c.category === cat);
        return <AuditSection key={cat} category={cat} items={items} />;
      })}
    </Column>
  );
}
