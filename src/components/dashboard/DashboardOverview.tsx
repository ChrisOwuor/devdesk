/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Server,
  Database,
  ShieldCheck,
  ExternalLink,
  MoreVertical,
  Plus,
  UserPlus,
  Trash2,
  DollarSign,
  TrendingDown,
  Globe,
} from "lucide-react";

interface DashboardOverviewProps {
  budgetConsumed: number; // e.g. 142500
  budgetTotal: number; // e.g. 250000
  setBudgetConsumed: (val: number) => void;
}

export default function DashboardOverview({
  budgetConsumed,
  budgetTotal,
  setBudgetConsumed,
}: DashboardOverviewProps) {
  const [editingBudget, setEditingBudget] = useState<boolean>(false);
  const [tempBudgetInput, setTempBudgetInput] = useState<string>(
    budgetConsumed.toString(),
  );

  const percentage = Math.round((budgetConsumed / budgetTotal) * 100);

  const handleBudgetSave = () => {
    const val = parseFloat(tempBudgetInput);
    if (!isNaN(val) && val >= 0 && val <= budgetTotal) {
      setBudgetConsumed(val);
      setEditingBudget(false);
    } else {
      alert(
        `Please enter a valid budget amount between 0 and $${budgetTotal.toLocaleString()}`,
      );
    }
  };

  return (
    <div id="overview-tab-canvas" className="space-y-6 p-4 w-full ">
      {/* Overview Top widgets rows */}
      <div id="overview-top-deck" className="grid grid-cols-12 gap-6">
        {/* Card 1: Safaricom Ltd Hero partner card */}
        <div
          id="safaricom-hero-card"
          className="col-span-12 lg:col-span-8 bg-background rounded-[0.75rem] shadow-custom  p-6 transition-all relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div id="hero-left-content">
              <div className="flex items-center gap-3.5 mb-4">
                <div>
                  <h3 className="text-[14px] font-semibold text-primary-custom">
                    Safaricom Ltd
                  </h3>
                  <p className="text-[14px] text-tertiary-custom ">
                    Strategic Tier 1 Partner
                  </p>
                </div>
              </div>
              <p className="text-sm text-tertiary-custom max-w-lg leading-relaxed">
                Implementing the next generation CRM system across East African
                regional offices. Focusing on automated customer journey mapping
                and real-time billing integration.
              </p>
            </div>
          </div>

          <div
            id="hero-button-actions"
            className="mt-8 flex gap-3 relative z-10"
          >
            <button
              id="view-crm-wp-btn"
              className="px-4 py-2 bg-primary-custom hover:bg-primary-hover text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-colors"
              onClick={() =>
                alert("CRM workspace connection verified successfully.")
              }
            >
              View CRM Workspace
            </button>
            <button
              id="client-portal-btn"
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              onClick={() =>
                window.open("https://www.safaricom.co.ke/", "_blank")
              }
            >
              Client Portal <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
            </button>
          </div>
        </div>

        {/* Card 2: Infrastructure Card */}
        <div
          id="infrastructure-card"
          className="col-span-12 lg:col-span-4 bg-background shadow-custom rounded-2xl p-6 transition-all relative overflow-hidden group "
        >
          <div
            id="infra-header"
            className="flex items-center justify-between mb-6"
          >
            <h3 className="text-[14px] font-semibold text-primary-custom">
              Infrastructure
            </h3>
          </div>

          <div id="infra-sla-items" className="space-y-4">
            {/* SLA Item 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background-custom shadow-custom transition-colors">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-primary-custom" />
                <div>
                  <p className="text-[12px] font-semibold text-primary-custom">
                    Production Nodes
                  </p>
                  <p className="text-[10px] text-tertiary-custom">
                    AWS us-east-1
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary-custom dark:text-primary-fixed-dim">
                99.9% UP
              </span>
            </div>

            {/* SLA Item 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background shadow-custom transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-primary-custom" />
                <div>
                  <p className="text-[12px] font-semibold text-primary-custom">
                    Database Instances
                  </p>
                  <p className="text-[10px] text-tertiary-custom">
                    PostgreSQL Clusters
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                12 Active
              </span>
            </div>

            {/* SLA Item 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background-custom shadow-custom transition-colors">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-[12px] font-semibold text-primary-custom">
                    SSL Certificates
                  </p>
                  <p className="text-[10px] text-tertiary-custom">
                    Let's Encrypt Wildcard
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Valid (45d)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
