import { createSignal, onCleanup } from "solid-js";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { figmaNotifyError } from "src/lib/figmaNotify";

enum ActionBtnStatus {
	IDLE = "IDLE",
	PROCESSING = "PROCESSING",
	RESULT = "RESULT",
}

enum ResultStatus {
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
}

type IProps = {
	class?: string;

	onAction: () => void | Promise<void>;
	content: string;
	successContent?: string;
	failureContent?: string;
};

export const ActionButton = (props: IProps) => {
	const [status, setStatus] = createSignal<ActionBtnStatus>(
		ActionBtnStatus.IDLE,
	);
	const [resultStatus, setResultStatus] = createSignal<ResultStatus>(
		ResultStatus.FAILURE,
	);
	let copyTimeout: null | NodeJS.Timeout = null;

	onCleanup(() => {
		if (copyTimeout != null) {
			clearTimeout(copyTimeout);
		}
	});

	const shouldShowResult = () => {
		return status() === ActionBtnStatus.RESULT;
	};

	const getResultContent = () => {
		if (resultStatus() === ResultStatus.SUCCESS) {
			return props.successContent ?? "Success!";
		}
		return props.failureContent ?? "Error!";
	};

	const handleClick = async () => {
		if (copyTimeout != null) {
			clearTimeout(copyTimeout);
			copyTimeout = null;
		}

		setStatus(ActionBtnStatus.PROCESSING);
		try {
			await props.onAction();
			setResultStatus(ResultStatus.SUCCESS);
		} catch (e) {
			console.log(e);
			setResultStatus(ResultStatus.FAILURE);
      figmaNotifyError("Error copying", e)
		}
		setStatus(ActionBtnStatus.RESULT);

		copyTimeout = setTimeout(() => {
			setStatus(ActionBtnStatus.IDLE);
			copyTimeout = null;
		}, 1000);
	};

	return (
		<Button
			classList={{ [props.class]: true, "relative overflow-hidden p-0": true }}
			onClick={handleClick}
			disabled={status() === ActionBtnStatus.PROCESSING}
		>
			<div
				classList={{
					"transition-transform": true,
					"absolute top-0 left-0 w-full h-full grid place-items-center grid-rows-[100%_100%]": true,
					"bg-green-400": resultStatus() === ResultStatus.SUCCESS,
					"bg-red-400": resultStatus() === ResultStatus.FAILURE,
					"-translate-y-full": !shouldShowResult(),
				}}
			>
				{getResultContent()}
			</div>

			<div
				classList={{
					"absolute top-0 left-0 w-full h-full grid place-items-center": true,
					"backdrop-blur-sm transition-transform": true,
					"translate-y-full": status() !== ActionBtnStatus.PROCESSING,
				}}
			>
				<Spinner class="border-blue-900/40 border-r-blue-900" thickness="3px" />
			</div>

			<div
				classList={{
					"transition-transform h-full flex items-center justify-center flex-col p-2": true,
					"translate-y-full": shouldShowResult(),
				}}
			>
				{props.content}
			</div>
		</Button>
	);
};
