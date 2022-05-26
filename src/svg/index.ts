const reqIcons = require.context('./icons', false, /\.svg$/);

const reqEmoji = require.context('./emoji', false, /\.svg$/);

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);

requireAll(reqIcons);

requireAll(reqEmoji);

export {};
