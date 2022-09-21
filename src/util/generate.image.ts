import {UltimateTextToImage} from "ultimate-text-to-image";

export function generateImage(s: string): string {
    return new UltimateTextToImage(s, {
        width: 1024,
        height: 1024,
        fontFamily: "Arial, Sans",
        fontColor: "#000000",
        fontSize: 180,
        lineHeight: 180,
        autoWrapLineHeightMultiplier: 1.2,
        margin: 20,
        align: "center",
        valign: "middle",
        backgroundColor: "#FFFFFF",
    }).render().toDataUrl()
}
