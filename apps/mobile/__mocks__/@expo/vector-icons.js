const React = require("react");
const { Text } = require("react-native");

module.exports = {
	Feather: (props) => React.createElement(Text, { ...props }, props.name || ""),
};
