counter = 1

max = tonumber(os.getenv("RESET_COUNTER")) or 1000;
size = os.getenv("SIZE")

if counter==1 then
print("max:",max>10)
end


if not size then
  print("Please execute with SIZE environment variable")
  print("SIZE=1k wrk -c100 -d10s http://localhost:80/static/")
  print("RESET_COUNTER=50 SIZE=1k wrk -c100 -d10s http://localhost:80/static/")

  os.exit()
end

request = function()
  path = "/static/" .. size .. "/file" .. string.format("%03d",counter) .. ".html"
  wrk.headers["X-Counter"] = counter
  counter = counter + 1
  if counter>=max then
    counter = 1;
  end
  return wrk.format(nil, path)
end
