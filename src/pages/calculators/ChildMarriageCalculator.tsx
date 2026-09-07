import { GoalCostPlanner } from "./GoalCostPlanner";

const ChildMarriageCalculator = () => (
  <GoalCostPlanner
    pageTitle="Child Marriage Planner"
    pageSubtitle="Wedding costs rise every year — estimate the future cost and the monthly SIP to celebrate without loans."
    goalLabel="Cost of the Wedding Today (₹)"
    goalHint="e.g. a wedding that would cost ₹25L today"
    defaultCost={2500000}
    leadSource="child_marriage_goal"
    leadTitle="Planning a dream wedding for your child?"
    leadSubtitle="We'll build a dedicated goal-based SIP so the celebration never needs a loan — free consultation."
  />
);

export default ChildMarriageCalculator;
