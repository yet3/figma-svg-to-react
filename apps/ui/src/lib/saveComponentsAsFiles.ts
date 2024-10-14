import { JSX_FRAMEWORKS } from "@shared/lib";
import type { FrameworkEnum, IComponent, IGenOptions } from "@shared/types";
import JSZip from "jszip";

interface IOpts {
	components: IComponent[];
	genOptions: IGenOptions;
	framework: FrameworkEnum;
}

export const saveComponentsAsFiles = async ({
	components,
	genOptions,
	framework,
}: IOpts) => {
	return new Promise<void>((resolve) => {
		let extension = "svg";

		if (JSX_FRAMEWORKS.includes(framework)) {
			extension = `${genOptions.typescript ? "t" : "j"}sx`;
		}

		if (components.length === 1) {
			const comp = components[0];
			downloadBlob(new Blob([comp.code]), `${comp.fileName}.${extension}`);
			return resolve();
		}

		const zip = new JSZip();
		const usedFileNames = new Map<string, number>();

		for (const comp of components) {
			const blob = new Blob([comp.code]);

			let fileName = comp.fileName;
			const usedTimes = usedFileNames.get(fileName) ?? 0;
			if (usedTimes > 0) {
				fileName = `${fileName} (${usedTimes})`;
			}
			usedFileNames.set(comp.fileName, usedTimes + 1);

			zip.file(`${fileName}.${extension}`, blob, {
				base64: true,
			});
		}

		zip.generateAsync({ type: "blob" }).then((blob: Blob) => {
			downloadBlob(blob, "generated_svgs.zip");
			resolve();
		});
	});
};

const downloadBlob = (blob: Blob, fileName: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.setAttribute("download", fileName);
	a.click();
	URL.revokeObjectURL(url);
};
