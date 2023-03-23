import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParserMongoIdPipe } from 'src/common/pipes/parser-mongo-id/parser-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // test staus code
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParserMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
