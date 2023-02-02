type PathSegments<Path extends string> =
    Path extends `${infer SegmentA}/${infer SegmentB}`
        ? ParamOnly<SegmentA> | PathSegments<SegmentB>
        : ParamOnly<Path>;

type ParamOnly<Segment extends string> = Segment extends `:${infer Param}`
    ? Param
    : never;

function replaceUrlParams<R extends undefined | string = undefined,
    T extends string = string>(url: T, params: Record<R extends string ? R : PathSegments<T>, string | number>, prefix?: string) {
    let returnString: string = url;
    Object.entries(params as Record<string, string>).forEach(([key, value]) => {
        returnString = returnString.replace(new RegExp(`:${key}`), value);
    });
    if (prefix === undefined)
        return returnString;

    if (!prefix.endsWith('/')) {
        returnString = prefix + '/' + returnString
    } else {
        returnString = prefix + returnString
    }
    return returnString.replace(/([^:])\/\/+/g, '$1/')
}

export const stringUtil = {replaceUrlParams}