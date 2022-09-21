import {UltimateTextToImage} from "ultimate-text-to-image";

export function generateImage(s: string): string {
    return new UltimateTextToImage(s, {
        width: 128,
        height: 128,
        fontFamily: "Arial, Sans",
        fontColor: "#000000",
        fontSize: 18,
        lineHeight: 18,
        autoWrapLineHeightMultiplier: 1.2,
        margin: 20,
        align: "center",
        valign: "middle",
        backgroundColor: "#FFFFFF",
    }).render().toDataUrl()
}
