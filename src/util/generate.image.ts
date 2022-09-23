import {UltimateTextToImage} from "ultimate-text-to-image";
import * as images from 'images'

const filterImage = images("./assets/filter.png")

export function generateImage(s: string): string {
    const imageBase64 = images(new UltimateTextToImage(s, {
        width: 1000,
        height: 560,
        fontFamily: "Arial, Sans",
        fontColor: "#000000",
        fontSize: 72,
        lineHeight: 72,
        autoWrapLineHeightMultiplier: 1.2,
        marginLeft: 350,
        marginRight: 20,
        align: "left",
        valign: "middle",
        backgroundColor: "#FFFFFF",
    }).render().toBuffer())
        .draw(filterImage, 0, 0)
        .toBuffer("jpg")
        .toString("base64")
    return "data:image/png;base64," + imageBase64
}
