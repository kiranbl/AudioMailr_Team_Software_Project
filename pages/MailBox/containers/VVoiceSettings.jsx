import { connect } from "react-redux";
import VoiceSettings from "../components/VoiceSettings";

const mapStateToProps = (state) => {
  return {
    display: state.voiceSettingsVisible ? "block" : "none",
    // ... (other necessary states)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // ... (necessary actions)
  };
};

const VVoiceSettings = connect(mapStateToProps, mapDispatchToProps)(VoiceSettings);

export default VVoiceSettings;
