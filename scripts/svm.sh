svm() {
  export NODE_NO_WARNINGS=1
  temporaryFile=$(mktemp /tmp/svm-eval.XXXXXX)
  TEMP_FILE=$temporaryFile svm-bin "$@"
  local exit_code=$?
  eval "$(cat "$temporaryFile")"
  rm -f "$temporaryFile"
  return ${exit_code}
}

svm activate 1>/dev/null