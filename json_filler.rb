#!/bin/env ruby

require 'json'

cities_path = 'site/tripster_cities.json'
tripster_files = Dir.glob('*.json')

arr = JSON.parse(File.open(cities_path).read)

tripster_files.each do |file_path|
  arr += JSON.parse(File.open(file_path).read)['cities']
end

arr.compact!

File.open(cities_path, 'w') do |file|
  file.write(JSON.pretty_generate(arr))
end
