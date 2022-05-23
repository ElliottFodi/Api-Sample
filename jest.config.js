export default { 
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|mjs?|tsx?|ts?)$",
    moduleNameMapper: {
        "^#src(.*)$": "<rootDir>/src$1",
    },
    testEnvironment: 'node'
    
}