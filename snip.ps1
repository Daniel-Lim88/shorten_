param([Parameter(ValueFromRemainingArguments = $true)] [string[]]$Args)
node "$PSScriptRoot/cli.js" @Args
