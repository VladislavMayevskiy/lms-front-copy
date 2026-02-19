import type { SVGProps } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";

type Props = {
  size?: number;
  isLoading?: boolean;
};

export const Spinner = ({ className, isLoading, size = 100, ...rest }: Props & SVGProps<SVGSVGElement>) => {
	return (
    <motion.div
      className={classNames("w-[100px] h-[100px] loading-wrapper", className)}
      initial={{ opacity: 0, display: 'none' }}
      animate={{ opacity: isLoading ? 1 : 0, display: isLoading ? 'flex' : 'none', width: `${size}px`, height: `${size}px` }}
      exit={{ opacity: isLoading ? 1 : 0, display: isLoading ? 'flex' : 'none', width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 120 120" className={classNames('stroke-primary w-full h-full', className)} {...rest}>
        <circle className="progress-circle" cx="60" cy="60" r="54" fill="none" strokeWidth="12" pathLength="100" />
      </svg>
    </motion.div>
	);
};
