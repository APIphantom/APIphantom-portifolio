import { motion } from "framer-motion";
import { ProblemSection } from "./ProblemSection";
import { ObjectivesSection } from "./ObjectivesSection";
import { ResearchSection } from "./ResearchSection";

type Props = {
  problem: string;
  objectives: string;
  research: string;
};

export function ProjectSectionTriple({ problem, objectives, research }: Props) {
  return (
    <section id="problem" className="px-6 lg:px-10 mt-10 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <ProblemSection title="Problema" text={problem} />
          </div>
          <div id="objectives" className="scroll-mt-24">
            <ObjectivesSection title="Objetivos" text={objectives} />
          </div>
          <div id="research" className="scroll-mt-24">
            <ResearchSection title="Pesquisa" text={research} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
