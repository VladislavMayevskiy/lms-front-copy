import type { SVGProps } from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { Spinner } from "components/ui/spinner";
import { useLoadingStore } from './useLoadingStore';

export const Loading = ({ className, ...rest }: SVGProps<SVGSVGElement>) => {
	const isLoading = useLoadingStore((store) => store.isLoading);

	return (
    <motion.div
      className={classNames("fixed inset-0 z-50 bg-modal", className)}
      initial={{ opacity: 0, display: 'none' }}
      animate={{ opacity: isLoading ? 1 : 0, display: isLoading ? 'flex' : 'none' }}
      exit={{ opacity: isLoading ? 1 : 0, display: isLoading ? 'flex' : 'none' }}
    >
      <div className="fixed inset-0 bg-modal-backdrop z-49 flex items-center justify-center p-2">
				{/* <div className="w-[100px] h-[100px] loading-wrapper">
					<svg viewBox="0 0 120 120" className={classNames('stroke-primary w-full h-full', className)} {...rest}>
						<circle className="progress-circle" cx="60" cy="60" r="54" fill="none" strokeWidth="12" pathLength="100" />
					</svg>
				</div> */}
				<Spinner
					isLoading={isLoading}
					{...rest}
				/>
			</div>
		</motion.div>
	);
};
