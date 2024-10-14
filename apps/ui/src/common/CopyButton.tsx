import { copyToClipboard } from "@lib";
import { ActionButton } from "./ActionButton";

interface IProps {
	content: string;
	getCopyContent: () => string | Promise<string>;
}

export const CopyButton = (props: IProps) => {
	return (
		<ActionButton
			content={props.content}
			successContent="Copied!"
			failureContent="Error!"
			onAction={async () => {
				if (!copyToClipboard(await props.getCopyContent())) {
					throw Error("Couldn't copy");
				}
			}}
		/>
	);
};
