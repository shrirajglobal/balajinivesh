import { GoalCostPlanner } from "./GoalCostPlanner";

const ChildEducationCalculator = () => (
  <GoalCostPlanner
    pageTitle="Child Education Planner"
    pageSubtitle="See what your child's education will really cost after inflation — and the monthly SIP to fund it."
    goalLabel="Cost of Education Today (₹)"
    goalHint="e.g. an engineering or medical degree costing ₹20L today"
    defaultCost={2000000}
    leadSource="child_education_goal"
    leadTitle="Want an education fund plan for your child?"
    leadSubtitle="We'll suggest a goal-based SIP matched to your timeline and risk profile — free, no obligation."
  />
);

export default ChildEducationCalculator;
