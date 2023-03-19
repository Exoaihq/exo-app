

export function deserializeJson(input: string): any | null {
    const jsonString = input.match(/{[^}]*}/)?.[0];
    console.log(jsonString)
    if (!jsonString) {
        return null
    }

    const deserializedObject = JSON.parse(jsonString);
    return deserializedObject;
}